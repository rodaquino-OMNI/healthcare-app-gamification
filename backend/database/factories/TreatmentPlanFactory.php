<?php

namespace Database\Factories;

use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TreatmentPlan>
 */
class TreatmentPlanFactory extends Factory
{
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-3 months', 'now');

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement([
                'Physical Therapy Program', 'Diabetes Management Plan',
                'Cardiac Rehabilitation', 'Weight Management Program',
                'Mental Health Support Plan', 'Post-Surgery Recovery',
            ]),
            'description' => fake()->paragraph(),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, '+12 months'),
            'progress' => fake()->randomFloat(1, 0, 100),
        ];
    }
}
