<?php

namespace Database\Factories;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationPreference>
 */
class NotificationPreferenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'push_enabled' => fake()->boolean(80),
            'email_enabled' => fake()->boolean(70),
            'sms_enabled' => fake()->boolean(40),
            'type_preferences' => fake()->randomElements(
                ['achievement', 'reminder', 'alert', 'info', 'gamification'],
                fake()->numberBetween(2, 5)
            ),
            'journey_preferences' => fake()->randomElements(
                ['health', 'care', 'wellness'],
                fake()->numberBetween(1, 3)
            ),
        ];
    }
}
