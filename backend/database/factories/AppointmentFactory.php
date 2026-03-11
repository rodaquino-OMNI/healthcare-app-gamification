<?php

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Models\Appointment;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider_id' => Provider::factory(),
            'date_time' => fake()->dateTimeBetween('-1 month', '+3 months'),
            'type' => fake()->randomElement(AppointmentType::cases()),
            'status' => fake()->randomElement(AppointmentStatus::cases()),
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
