<?php

namespace Database\Factories;

use App\Enums\GoalPeriod;
use App\Enums\GoalStatus;
use App\Enums\GoalType;
use App\Models\HealthGoal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthGoal>
 */
class HealthGoalFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(GoalType::cases());
        $status = fake()->randomElement(GoalStatus::cases());
        $targetValue = fake()->randomFloat(1, 10, 10000);
        $startDate = fake()->dateTimeBetween('-3 months', 'now');

        return [
            'record_id' => fake()->uuid(),
            'type' => $type,
            'title' => fake()->sentence(4),
            'description' => fake()->sentence(),
            'target_value' => $targetValue,
            'unit' => fake()->randomElement(['steps', 'hours', 'ml', 'kg', 'minutes', 'bpm', 'mmHg', 'mg/dL']),
            'current_value' => fake()->randomFloat(1, 0, $targetValue),
            'status' => $status,
            'period' => fake()->randomElement(GoalPeriod::cases()),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, '+6 months'),
            'completed_date' => $status === GoalStatus::COMPLETED ? fake()->dateTimeBetween($startDate, 'now') : null,
        ];
    }
}
