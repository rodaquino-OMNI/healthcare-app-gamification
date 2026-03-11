<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Medication>
 */
class MedicationFactory extends Factory
{
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement([
                'Amoxicillin', 'Lisinopril', 'Metformin', 'Atorvastatin',
                'Omeprazole', 'Losartan', 'Amlodipine', 'Simvastatin',
                'Levothyroxine', 'Ibuprofen', 'Prednisone', 'Gabapentin',
            ]),
            'dosage' => fake()->randomFloat(1, 5, 500),
            'frequency' => fake()->randomElement([
                'Once daily', 'Twice daily', 'Three times daily',
                'Every 8 hours', 'Every 12 hours', 'As needed',
            ]),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, '+6 months'),
            'reminder_enabled' => fake()->boolean(80),
            'notes' => fake()->optional()->sentence(),
            'active' => fake()->boolean(70),
        ];
    }
}
