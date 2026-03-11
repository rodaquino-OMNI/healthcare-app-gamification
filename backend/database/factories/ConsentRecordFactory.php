<?php

namespace Database\Factories;

use App\Enums\ConsentStatus;
use App\Enums\ConsentType;
use App\Models\ConsentRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConsentRecord>
 */
class ConsentRecordFactory extends Factory
{
    public function definition(): array
    {
        $status = fake()->randomElement(ConsentStatus::cases());
        $grantedAt = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'user_id' => User::factory(),
            'consent_type' => fake()->randomElement(ConsentType::cases()),
            'status' => $status,
            'purpose' => fake()->sentence(),
            'data_categories' => fake()->randomElements(
                ['personal', 'health', 'financial', 'behavioral', 'location', 'biometric'],
                fake()->numberBetween(1, 4)
            ),
            'granted_at' => $grantedAt,
            'expires_at' => fake()->dateTimeBetween($grantedAt, '+2 years'),
            'revoked_at' => $status === ConsentStatus::REVOKED ? fake()->dateTimeBetween($grantedAt, 'now') : null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'version' => fake()->numberBetween(1, 5),
        ];
    }
}
