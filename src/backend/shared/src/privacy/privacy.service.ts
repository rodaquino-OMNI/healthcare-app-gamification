/* eslint-disable */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

/**
 * Service implementing LGPD Data Subject Rights (Art. 18).
 *
 * Provides:
 * - getMyData       (Art. 18-II  - access)
 * - exportAsFhirBundle (Art. 18-V - portability)
 * - deleteMyData    (Art. 18-VI  - erasure / right to be forgotten)
 * - rectifyMyData   (Art. 18-III - rectification)
 */
@Injectable()
export class PrivacyService {
    constructor(private readonly prisma: PrismaService) {}

    // ──────────────────────────────────────────────────────────
    // Art. 18-II  -  Access to personal data
    // ──────────────────────────────────────────────────────────

    async getMyData(userId: string): Promise<object> {
        const [
            user,
            appointments,
            medications,
            healthMetrics,
            healthGoals,
            claims,
            plans,
            deviceConnections,
            notifications,
            gameProfile,
            medicalEvents,
            treatmentPlans,
            telemedicineSessions,
        ] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    cpf: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.appointment.findMany({ where: { userId } }),
            this.prisma.medication.findMany({ where: { userId } }),
            this.prisma.healthMetric.findMany({ where: { userId } }),
            this.prisma.healthGoal.findMany({ where: { recordId: userId } }),
            this.prisma.claim.findMany({ where: { userId } }),
            this.prisma.plan.findMany({ where: { userId } }),
            this.prisma.deviceConnection.findMany({ where: { userId } }),
            this.prisma.notification.findMany({ where: { userId } }),
            this.prisma.gameProfile.findUnique({
                where: { userId },
                include: {
                    achievements: true,
                    quests: true,
                    rewards: true,
                },
            }),
            this.prisma.medicalEvent.findMany({ where: { userId } }),
            this.prisma.treatmentPlan.findMany({ where: { userId } }),
            this.prisma.telemedicineSession.findMany({
                where: { patientId: userId },
            }),
        ]);

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'PRIVACY_001', { userId });
        }

        return {
            user,
            appointments,
            medications,
            healthMetrics,
            healthGoals,
            claims,
            plans,
            deviceConnections,
            notifications,
            gameProfile,
            medicalEvents,
            treatmentPlans,
            telemedicineSessions,
        };
    }

    // ──────────────────────────────────────────────────────────
    // Art. 18-V  -  Portability (FHIR R4 Bundle)
    // ──────────────────────────────────────────────────────────

    async exportAsFhirBundle(userId: string): Promise<object> {
        const data = (await this.getMyData(userId)) as Record<string, unknown>;
        const user = data.user as Record<string, unknown>;

        const entries: object[] = [];

        // Patient resource
        entries.push({
            fullUrl: `urn:uuid:${user.id}`,
            resource: {
                resourceType: 'Patient',
                id: user.id,
                name: [{ use: 'official', text: user.name }],
                telecom: [
                    ...(user.email ? [{ system: 'email', value: user.email }] : []),
                    ...(user.phone ? [{ system: 'phone', value: user.phone }] : []),
                ],
                identifier: user.cpf
                    ? [
                          {
                              system: 'urn:oid:2.16.840.1.113883.13.236',
                              value: user.cpf,
                          },
                      ]
                    : [],
            },
        });

        // Observation resources from HealthMetrics
        for (const metric of data.healthMetrics as unknown[]) {
            entries.push({
                fullUrl: `urn:uuid:${metric.id}`,
                resource: {
                    resourceType: 'Observation',
                    id: metric.id,
                    status: 'final',
                    code: {
                        coding: [
                            {
                                system: 'http://loinc.org',
                                code: this.mapMetricTypeToLoinc(metric.type),
                                display: metric.type,
                            },
                        ],
                    },
                    subject: { reference: `Patient/${user.id}` },
                    effectiveDateTime: metric.timestamp,
                    valueQuantity: {
                        value: metric.value,
                        unit: metric.unit,
                    },
                },
            });
        }

        // MedicationStatement resources
        for (const med of data.medications as unknown[]) {
            entries.push({
                fullUrl: `urn:uuid:${med.id}`,
                resource: {
                    resourceType: 'MedicationStatement',
                    id: med.id,
                    status: med.active ? 'active' : 'completed',
                    medicationCodeableConcept: {
                        text: med.name,
                    },
                    subject: { reference: `Patient/${user.id}` },
                    effectivePeriod: {
                        start: med.startDate,
                        ...(med.endDate ? { end: med.endDate } : {}),
                    },
                    dosage: [
                        {
                            text: `${med.dosage} - ${med.frequency}`,
                        },
                    ],
                },
            });
        }

        // Appointment resources
        for (const appt of data.appointments as unknown[]) {
            entries.push({
                fullUrl: `urn:uuid:${appt.id}`,
                resource: {
                    resourceType: 'Appointment',
                    id: appt.id,
                    status: this.mapAppointmentStatus(appt.status),
                    start: appt.dateTime,
                    participant: [
                        {
                            actor: { reference: `Patient/${user.id}` },
                            status: 'accepted',
                        },
                    ],
                    appointmentType: {
                        text: appt.type,
                    },
                },
            });
        }

        return {
            resourceType: 'Bundle',
            type: 'collection',
            timestamp: new Date().toISOString(),
            total: entries.length,
            entry: entries,
        };
    }

    // ──────────────────────────────────────────────────────────
    // Art. 18-VI  -  Erasure (right to be forgotten)
    // ──────────────────────────────────────────────────────────

    async deleteMyData(userId: string): Promise<{ deletedCounts: Record<string, number> }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'PRIVACY_002', { userId });
        }

        const deletedCounts: Record<string, number> = {};

        await this.prisma.$transaction(async (tx: Record<string, unknown>) => {
            // 1. Gamification child tables (via gameProfile)
            const gameProfile = await tx.gameProfile.findUnique({
                where: { userId },
            });

            if (gameProfile) {
                const delAchievements = await tx.userAchievement.deleteMany({
                    where: { profileId: gameProfile.id },
                });
                deletedCounts['userAchievement'] = delAchievements.count;

                const delQuests = await tx.userQuest.deleteMany({
                    where: { profileId: gameProfile.id },
                });
                deletedCounts['userQuest'] = delQuests.count;

                const delRewards = await tx.userReward.deleteMany({
                    where: { profileId: gameProfile.id },
                });
                deletedCounts['userReward'] = delRewards.count;

                // 2. GameProfile itself
                await tx.gameProfile.delete({ where: { id: gameProfile.id } });
                deletedCounts['gameProfile'] = 1;
            }

            // 3. Notifications & preferences
            const delNotifications = await tx.notification.deleteMany({
                where: { userId },
            });
            deletedCounts['notification'] = delNotifications.count;

            const delNotifPrefs = await tx.notificationPreference.deleteMany({
                where: { userId },
            });
            deletedCounts['notificationPreference'] = delNotifPrefs.count;

            // 4. Telemedicine sessions (as patient)
            const delTelemed = await tx.telemedicineSession.deleteMany({
                where: { patientId: userId },
            });
            deletedCounts['telemedicineSession'] = delTelemed.count;

            // 5. Appointments
            const delAppointments = await tx.appointment.deleteMany({
                where: { userId },
            });
            deletedCounts['appointment'] = delAppointments.count;

            // 6. Medications & treatment plans
            const delMedications = await tx.medication.deleteMany({
                where: { userId },
            });
            deletedCounts['medication'] = delMedications.count;

            const delTreatments = await tx.treatmentPlan.deleteMany({
                where: { userId },
            });
            deletedCounts['treatmentPlan'] = delTreatments.count;

            // 7. Health data
            const delDevices = await tx.deviceConnection.deleteMany({
                where: { userId },
            });
            deletedCounts['deviceConnection'] = delDevices.count;

            const delMetrics = await tx.healthMetric.deleteMany({
                where: { userId },
            });
            deletedCounts['healthMetric'] = delMetrics.count;

            const delGoals = await tx.healthGoal.deleteMany({
                where: { recordId: userId },
            });
            deletedCounts['healthGoal'] = delGoals.count;

            const delEvents = await tx.medicalEvent.deleteMany({
                where: { userId },
            });
            deletedCounts['medicalEvent'] = delEvents.count;

            // 8. Plan data (claims depend on plans, but claims also
            //    reference userId directly, and plans own benefits/coverages)
            const delClaims = await tx.claim.deleteMany({
                where: { userId },
            });
            deletedCounts['claim'] = delClaims.count;

            // Delete benefits and coverages for user's plans
            const userPlans = await tx.plan.findMany({
                where: { userId },
                select: { id: true },
            });
            const planIds = userPlans.map((p: Record<string, unknown>) => p.id);

            if (planIds.length > 0) {
                const delBenefits = await tx.benefit.deleteMany({
                    where: { planId: { in: planIds } },
                });
                deletedCounts['benefit'] = delBenefits.count;

                const delCoverages = await tx.coverage.deleteMany({
                    where: { planId: { in: planIds } },
                });
                deletedCounts['coverage'] = delCoverages.count;
            }

            const delPlans = await tx.plan.deleteMany({
                where: { userId },
            });
            deletedCounts['plan'] = delPlans.count;

            // 9. Documents linked to user's entities
            const delDocuments = await tx.document.deleteMany({
                where: { entityId: userId },
            });
            deletedCounts['document'] = delDocuments.count;

            // 10. ConsentRecord (check at runtime - may be added by parallel agent)
            try {
                if (tx.consentRecord) {
                    const delConsent = await tx.consentRecord.deleteMany({
                        where: { userId },
                    });
                    deletedCounts['consentRecord'] = delConsent.count;
                }
            } catch {
                // consentRecord model does not exist yet - skip silently
            }

            // 11. Audit log entries (keep for regulatory compliance,
            //     but anonymize the userId)
            await tx.auditLog.updateMany({
                where: { userId },
                data: { userId: 'DELETED_USER' },
            });

            // 12. User (last)
            await tx.user.delete({ where: { id: userId } });
            deletedCounts['user'] = 1;
        });

        return { deletedCounts };
    }

    // ──────────────────────────────────────────────────────────
    // Art. 18-III  -  Rectification
    // ──────────────────────────────────────────────────────────

    async rectifyMyData(userId: string, updates: { name?: string; email?: string; phone?: string }): Promise<object> {
        // Validate there is at least one field to update
        const fieldsToUpdate: Record<string, string> = {};

        if (updates.name !== undefined) {
            fieldsToUpdate.name = updates.name;
        }
        if (updates.phone !== undefined) {
            fieldsToUpdate.phone = updates.phone;
        }
        if (updates.email !== undefined) {
            // Check email uniqueness
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: updates.email,
                    NOT: { id: userId },
                },
            });

            if (existing) {
                throw new AppException('Email already in use by another account', ErrorType.VALIDATION, 'PRIVACY_003', {
                    email: updates.email,
                });
            }

            fieldsToUpdate.email = updates.email;
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new AppException(
                'At least one field (name, email, phone) must be provided',
                ErrorType.VALIDATION,
                'PRIVACY_004'
            );
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: fieldsToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                cpf: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return updated;
    }

    // ──────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────

    private mapMetricTypeToLoinc(metricType: string): string {
        const map: Record<string, string> = {
            HEART_RATE: '8867-4',
            BLOOD_PRESSURE_SYSTOLIC: '8480-6',
            BLOOD_PRESSURE_DIASTOLIC: '8462-4',
            BLOOD_GLUCOSE: '2339-0',
            WEIGHT: '29463-7',
            STEPS: '41950-7',
            BODY_TEMPERATURE: '8310-5',
            OXYGEN_SATURATION: '2708-6',
            RESPIRATORY_RATE: '9279-1',
            SLEEP: '93832-4',
            CALORIES: '41981-2',
            DISTANCE: '41953-1',
        };
        return map[metricType] || 'unknown';
    }

    private mapAppointmentStatus(status: string): string {
        const map: Record<string, string> = {
            SCHEDULED: 'booked',
            COMPLETED: 'fulfilled',
            CANCELLED: 'cancelled',
        };
        return map[status] || 'proposed';
    }
}
