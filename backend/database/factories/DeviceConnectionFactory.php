<?php

namespace Database\Factories;

use App\Enums\DeviceConnectionStatus;
use App\Enums\DeviceType;
use App\Models\DeviceConnection;
use App\Models\HealthMetric;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeviceConnection>
 */
class DeviceConnectionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'record_id' => fake()->uuid(),
            'device_type' => fake()->randomElement(DeviceType::cases()),
            'device_id' => fake()->unique()->bothify('DEV-####-????'),
            'status' => fake()->randomElement(DeviceConnectionStatus::cases()),
            'last_sync' => fake()->dateTimeBetween('-7 days', 'now'),
            'auth_token' => fake()->sha256(),
            'refresh_token' => fake()->sha256(),
            'token_expiry' => fake()->dateTimeBetween('now', '+30 days'),
            'metadata' => [
                'firmware_version' => fake()->semver(),
                'battery_level' => fake()->numberBetween(0, 100),
                'model' => fake()->word(),
            ],
        ];
    }
}
