<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['achievement', 'reminder', 'alert', 'info', 'gamification']),
            'title' => fake()->sentence(4),
            'body' => fake()->paragraph(),
            'channel' => fake()->randomElement(['push', 'email', 'sms', 'in_app']),
            'status' => fake()->randomElement(['pending', 'sent', 'read', 'failed']),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
            'metadata' => [
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
            ],
            'achievement_id' => null,
            'points' => fake()->optional()->numberBetween(10, 500),
            'badge_id' => null,
            'level' => fake()->optional()->numberBetween(1, 50),
            'gamification_event_type' => fake()->optional()->randomElement(['xp_gained', 'level_up', 'achievement_unlocked']),
            'points_earned' => fake()->optional()->numberBetween(10, 200),
            'new_level' => fake()->optional()->numberBetween(1, 50),
            'show_celebration' => fake()->boolean(20),
        ];
    }
}
