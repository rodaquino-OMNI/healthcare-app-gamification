<?php

namespace Database\Factories;

use App\Models\Benefit;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Benefit>
 */
class BenefitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'plan_id' => Plan::factory(),
            'type' => fake()->randomElement([
                'consultation', 'hospitalization', 'surgery', 'maternity',
                'dental', 'vision', 'mental_health', 'rehabilitation',
            ]),
            'description' => fake()->paragraph(),
            'limitations' => fake()->sentence(),
            'usage' => fake()->randomElement(['unlimited', '12 per year', '24 per year', '6 per year']),
        ];
    }
}
