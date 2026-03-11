<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => fake()->randomElement([
                'create', 'update', 'delete', 'login', 'logout',
                'export', 'import', 'view', 'approve', 'reject',
            ]),
            'resource_type' => fake()->optional()->randomElement([
                'Appointment', 'Claim', 'Plan', 'Medication', 'User',
            ]),
            'resource_id' => fake()->optional()->uuid(),
            'journey_id' => fake()->optional()->uuid(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'metadata' => [
                'browser' => fake()->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'os' => fake()->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
            ],
            'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
