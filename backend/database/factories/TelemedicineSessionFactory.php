<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Provider;
use App\Models\TelemedicineSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TelemedicineSession>
 */
class TelemedicineSessionFactory extends Factory
{
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-1 month', '+1 month');

        return [
            'appointment_id' => Appointment::factory(),
            'patient_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'start_time' => $startTime,
            'end_time' => fake()->dateTimeBetween($startTime, (clone $startTime)->modify('+2 hours')),
            'status' => fake()->randomElement(['waiting', 'in_progress', 'completed', 'cancelled']),
        ];
    }
}
