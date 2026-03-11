<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    public function definition(): array
    {
        $validityStart = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'user_id' => User::factory(),
            'plan_number' => fake()->unique()->bothify('PLN-####-????'),
            'type' => fake()->randomElement(['basic', 'standard', 'premium', 'enterprise']),
            'validity_start' => $validityStart,
            'validity_end' => fake()->dateTimeBetween($validityStart, '+2 years'),
            'coverage_details' => [
                'medical' => fake()->boolean(90),
                'dental' => fake()->boolean(60),
                'vision' => fake()->boolean(50),
                'mental_health' => fake()->boolean(70),
            ],
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
        ];
    }
}
