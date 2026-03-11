<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Provider>
 */
class ProviderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name() . ', ' . fake()->randomElement(['MD', 'DO', 'NP', 'PA']),
            'specialty' => fake()->randomElement([
                'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
                'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
                'Psychiatry', 'Radiology', 'Surgery', 'Family Medicine',
            ]),
            'location' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'telemedicine_available' => fake()->boolean(70),
        ];
    }
}
