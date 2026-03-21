import { Injectable } from '@nestjs/common';

import { PrismaHealthMetric, PrismaTransactionClient } from './health-metrics.service';

/**
 * Service responsible for checking and updating health goals
 * based on newly recorded health metrics.
 */
@Injectable()
export class HealthGoalsService {
    /**
     * Checks active health goals for the user and updates progress
     * based on the newly recorded metric.
     *
     * For cumulative metrics (steps, calories, distance, floors, activity),
     * the metric value is added to the current goal value.
     * For instantaneous metrics (heart rate, blood pressure, etc.),
     * the goal value is replaced with the new metric value.
     *
     * @param prisma Prisma transaction client
     * @param userId User ID
     * @param metric Newly recorded metric
     */
    async checkAndUpdateHealthGoals(
        prisma: PrismaTransactionClient,
        userId: string,
        metric: PrismaHealthMetric
    ): Promise<void> {
        // Find active goals for this metric type
        const activeGoals = await prisma.healthGoal.findMany({
            where: {
                userId,
                type: metric.type,
                status: 'ACTIVE',
            },
        });

        for (const goal of activeGoals) {
            let newValue = goal.currentValue;

            // For cumulative metrics (steps, calories, etc.), add to current value
            if (['STEPS', 'CALORIES', 'DISTANCE', 'FLOORS', 'ACTIVITY'].includes(metric.type)) {
                newValue = goal.currentValue + metric.value;
            } else {
                // For instantaneous metrics, use the new value
                newValue = metric.value;
            }

            const progress = Math.min(100, (newValue / goal.targetValue) * 100);

            await prisma.healthGoal.update({
                where: { id: goal.id },
                data: {
                    currentValue: newValue,
                    progress,
                    status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
                    updatedAt: new Date(),
                },
            });
        }
    }
}
