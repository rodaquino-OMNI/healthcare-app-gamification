<?php

namespace Database\Factories;

use App\Models\Coverage;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coverage>
 */
class CoverageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'plan_id' => Plan::factory(),
            'type' => fake()->randomElement([
                'inpatient', 'outpatient', 'emergency', 'preventive',
                'specialist', 'pharmacy', 'lab', 'imaging',
            ]),
            'details' => fake()->paragraph(),
            'limitations' => fake()->sentence(),
            'co_payment' => fake()->randomFloat(2, 10, 200),
        ];
    }
}
