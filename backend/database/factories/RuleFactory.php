<?php

namespace Database\Factories;

use App\Models\Rule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rule>
 */
class RuleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event' => fake()->randomElement([
                'appointment.completed', 'medication.taken', 'goal.achieved',
                'steps.target_reached', 'profile.updated', 'checkin.daily',
            ]),
            'condition' => fake()->randomElement([
                'count >= 1', 'count >= 5', 'streak >= 7', 'value >= 10000',
            ]),
            'actions' => [
                [
                    'type' => fake()->randomElement(['grant_xp', 'unlock_achievement', 'send_notification']),
                    'value' => fake()->numberBetween(10, 200),
                ],
            ],
        ];
    }
}
