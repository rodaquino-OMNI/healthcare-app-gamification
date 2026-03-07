/* eslint-disable */
import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Updated import paths to use the correct locations
import { Parser } from 'expr-eval';

import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Event interface for the gamification engine
 */
export interface GamificationEvent {
    type: string;
    userId: string;
    timestamp: Date;
    journey: string;
    data: Record<string, any>;
    metadata: Record<string, any>;
}

/**
 * Rule interface for defining gamification rules
 */
export interface Rule {
    id: string;
    name: string;
    description: string;
    eventType: string;
    journey: string;
    condition: string;
    actions: RuleAction[];
    enabled: boolean;
}

/**
 * Rule evaluation result interface
 */
export interface RuleEvaluationResult {
    satisfied: boolean;
    metadata?: Record<string, any>;
}

/**
 * Action interface for rule actions
 */
export interface RuleAction {
    type: 'AWARD_XP' | 'UNLOCK_ACHIEVEMENT' | 'PROGRESS_QUEST';
    value: number | string;
    metadata?: Record<string, any>;
}

/**
 * Service responsible for managing and executing gamification rules.
 */
@Injectable()
export class RulesService implements OnModuleInit {
    private rules: Rule[] = [];
    private readonly parser = new Parser();
    private readonly rulesRefreshInterval: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
        private readonly prisma: PrismaService,
        private readonly profilesService: ProfilesService,
        private readonly achievementsService: AchievementsService
    ) {
        this.rulesRefreshInterval = this.configService.get<number>('gamification.rules.refreshInterval', 60000);
    }

    /**
     * Initialize the rules service by loading rules and setting up a refresh interval.
     */
    async onModuleInit() {
        try {
            await this.loadRules();

            // Set up periodic refresh of rules
            setInterval(async () => {
                try {
                    await this.loadRules();
                } catch (error) {
                    this.logger.error(
                        `Failed to refresh rules: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                        error instanceof Error ? (error as any).stack : undefined,
                        'RulesService'
                    );
                }
            }, this.rulesRefreshInterval);

            this.logger.log('RulesService initialized successfully', 'RulesService');
        } catch (error) {
            this.logger.error(
                `Failed to initialize RulesService: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            throw error as any;
        }
    }

    /**
     * Process an event against the configured rules.
     * @param event The event to process
     */
    async processEvent(event: GamificationEvent): Promise<void> {
        try {
            this.logger.log(`Processing event: ${event.type} for user ${event.userId}`, 'RulesService');

            // Find applicable rules for this event type
            const applicableRules = this.rules.filter(
                (rule) =>
                    rule.enabled &&
                    rule.eventType === event.type &&
                    (rule.journey === event.journey || rule.journey === 'all')
            );

            if (applicableRules.length === 0) {
                this.logger.log(`No applicable rules found for event: ${event.type}`, 'RulesService');
                return;
            }

            // Get user profile for context in rule evaluation
            const userProfile = await this.profilesService.findById(event.userId).catch(async (error) => {
                // If profile doesn't exist, create one
                if (error.name === 'NotFoundException') {
                    this.logger.log(`Creating new profile for user: ${event.userId}`, 'RulesService');
                    return this.profilesService.create(event.userId);
                }
                throw error;
            });

            // Evaluate each applicable rule
            for (const rule of applicableRules) {
                await this.evaluateRule(rule, event, userProfile);
            }

            this.logger.log(`Completed processing event: ${event.type} for user ${event.userId}`, 'RulesService');
        } catch (error) {
            this.logger.error(
                `Error processing event ${event.type} for user ${event.userId}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
        }
    }

    /**
     * Process a specific rule against an event.
     * @param ruleId The ID of the rule to process
     * @param event The event data
     * @param userProfile The user's profile data
     * @returns A promise with the rule evaluation result
     */
    async processRule(ruleId: string, event: any, userProfile: any): Promise<RuleEvaluationResult> {
        try {
            // Find the rule by ID
            const rule = this.rules.find((r) => r.id === ruleId);

            if (!rule) {
                throw new Error(`Rule with ID ${ruleId} not found`);
            }

            // Create context for evaluating the rule
            const context = {
                event: {
                    type: event.type,
                    data: event.data || {},
                    metadata: event.metadata || {},
                    journey: event.journey,
                    timestamp: event.timestamp || new Date(),
                },
                user: {
                    id: event.userId,
                    profile: userProfile,
                    level: userProfile?.level || 1,
                    xp: userProfile?.xp || 0,
                },
            };

            // Evaluate the condition
            const conditionResult = await this.evaluateCondition(rule.condition, context);

            return {
                satisfied: conditionResult,
                metadata: { ruleId: rule.id, ruleName: rule.name },
            };
        } catch (error) {
            this.logger.error(
                `Error processing rule ${ruleId}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            return { satisfied: false };
        }
    }

    /**
     * Get all available rules
     * @returns Array of all rules
     */
    async getAll(): Promise<Rule[]> {
        return this.rules;
    }

    /**
     * Evaluate a single rule against an event and user profile.
     * @param rule The rule to evaluate
     * @param event The event being processed
     * @param userProfile The user's game profile
     */
    private async evaluateRule(rule: Rule, event: GamificationEvent, userProfile: any): Promise<void> {
        try {
            this.logger.log(`Evaluating rule: ${rule.name} for event: ${event.type}`, 'RulesService');

            // Create a context for rule evaluation
            const context = {
                event: {
                    type: event.type,
                    data: event.data,
                    metadata: event.metadata,
                    journey: event.journey,
                    timestamp: event.timestamp,
                },
                user: {
                    id: event.userId,
                    profile: userProfile,
                    level: userProfile.level,
                    xp: userProfile.xp,
                },
            };

            // Evaluate condition using expr-eval safe expression parser (no arbitrary code execution)
            const conditionResult = await this.evaluateCondition(rule.condition, context);

            if (!conditionResult) {
                this.logger.log(`Rule condition not met: ${rule.name}`, 'RulesService');
                return;
            }

            this.logger.log(`Rule condition met: ${rule.name}, executing actions`, 'RulesService');

            // Execute rule actions
            for (const action of rule.actions) {
                await this.executeAction(action, event.userId, context);
            }

            this.logger.log(`Rule ${rule.name} processed successfully`, 'RulesService');
        } catch (error) {
            this.logger.error(
                `Error evaluating rule ${rule.name}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
        }
    }

    /**
     * Evaluate a rule condition against a context.
     * @param condition The condition to evaluate
     * @param context The context to evaluate against
     * @returns True if the condition is met, false otherwise
     */
    private async evaluateCondition(condition: string, context: any): Promise<boolean> {
        try {
            const expr = this.parser.parse(condition);
            return expr.evaluate(context) === true;
        } catch (error) {
            this.logger.error(
                `Error evaluating condition: ${condition}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            return false;
        }
    }

    /**
     * Execute a rule action.
     * @param action The action to execute
     * @param userId The user ID
     * @param context The context for action execution
     */
    private async executeAction(action: RuleAction, userId: string, _context: unknown): Promise<void> {
        try {
            switch (action.type) {
                case 'AWARD_XP':
                    await this.awardXP(userId, Number(action.value));
                    break;

                case 'UNLOCK_ACHIEVEMENT':
                    await this.unlockAchievement(userId, String(action.value));
                    break;

                case 'PROGRESS_QUEST':
                    // Quest progress implementation would go here
                    this.logger.log(`Quest progress action not implemented yet`, 'RulesService');
                    break;

                default:
                    this.logger.warn(`Unknown action type: ${action.type}`, 'RulesService');
                    break;
            }
        } catch (error) {
            this.logger.error(
                `Error executing action ${action.type}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
        }
    }

    /**
     * Award XP to a user.
     * @param userId The user ID
     * @param xp The amount of XP to award
     */
    private async awardXP(userId: string, xp: number): Promise<void> {
        try {
            this.logger.log(`Awarding ${xp} XP to user ${userId}`, 'RulesService');

            const profile = await this.profilesService.findById(userId);
            const updatedProfile = await this.profilesService.update(userId, {
                xp: profile.xp + xp,
                level: this.calculateLevel(profile.xp + xp),
            });

            this.logger.log(
                `Successfully awarded ${xp} XP to user ${userId}. New XP: ${updatedProfile.xp}, Level: ${updatedProfile.level}`,
                'RulesService'
            );
        } catch (error) {
            this.logger.error(
                `Error awarding XP to user ${userId}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            throw error as any;
        }
    }

    /**
     * Unlock an achievement for a user.
     * @param userId The user ID
     * @param achievementId The achievement ID to unlock
     */
    private async unlockAchievement(userId: string, achievementId: string): Promise<void> {
        try {
            this.logger.log(`Unlocking achievement ${achievementId} for user ${userId}`, 'RulesService');

            await this.achievementsService.unlockAchievement(userId, achievementId);

            this.logger.log(`Successfully unlocked achievement ${achievementId} for user ${userId}`, 'RulesService');
        } catch (error) {
            this.logger.error(
                `Error unlocking achievement ${achievementId} for user ${userId}: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            throw error as any;
        }
    }

    /**
     * Calculate level based on XP.
     * @param xp The amount of XP
     * @returns The calculated level
     */
    private calculateLevel(xp: number): number {
        // Simple level calculation: level = 1 + floor(xp / 100)
        // In production, you'd want a more sophisticated level curve
        return Math.floor(xp / 100) + 1;
    }

    /**
     * Load rules from the database.
     */
    private async loadRules(): Promise<void> {
        try {
            this.logger.log('Loading rules from database', 'RulesService');

            // In a real implementation, this would load rules from the database
            // For now, we'll use a simple hardcoded set of rules
            this.rules = [
                {
                    id: 'health-steps-goal',
                    name: 'Daily Steps Goal',
                    description: 'Award XP when user completes their daily steps goal',
                    eventType: 'STEPS_RECORDED',
                    journey: 'health',
                    condition: 'event.data.steps >= 10000',
                    actions: [
                        {
                            type: 'AWARD_XP',
                            value: 50,
                        },
                        {
                            type: 'UNLOCK_ACHIEVEMENT',
                            value: '1a2b3c4d-2222-2222-2222-222222222222', // Step Master achievement
                        },
                    ],
                    enabled: true,
                },
                {
                    id: 'care-appointment-booked',
                    name: 'Appointment Booking',
                    description: 'Award XP when user books an appointment',
                    eventType: 'APPOINTMENT_BOOKED',
                    journey: 'care',
                    condition: 'true', // Always award for booking an appointment
                    actions: [
                        {
                            type: 'AWARD_XP',
                            value: 30,
                        },
                        {
                            type: 'UNLOCK_ACHIEVEMENT',
                            value: '2a3b4c5d-1111-1111-1111-111111111111', // Care Beginner achievement
                        },
                    ],
                    enabled: true,
                },
                {
                    id: 'plan-claim-submitted',
                    name: 'Claim Submission',
                    description: 'Award XP when user submits a claim',
                    eventType: 'CLAIM_SUBMITTED',
                    journey: 'plan',
                    condition: 'event.data.docCount >= 3', // Complete documentation
                    actions: [
                        {
                            type: 'AWARD_XP',
                            value: 40,
                        },
                        {
                            type: 'UNLOCK_ACHIEVEMENT',
                            value: '3a4b5c6d-3333-3333-3333-333333333333', // Claim Expert achievement
                        },
                    ],
                    enabled: true,
                },
            ];

            this.logger.log(`Loaded ${this.rules.length} rules`, 'RulesService');
        } catch (error) {
            this.logger.error(
                `Error loading rules: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'RulesService'
            );
            throw error as any;
        }
    }
}
