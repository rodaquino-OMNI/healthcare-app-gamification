<?php

namespace Database\Factories;

use App\Models\NotificationTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotificationTemplate>
 */
class NotificationTemplateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'template_id' => fake()->unique()->slug(3),
            'language' => fake()->randomElement(['en', 'pt', 'es']),
            'title' => fake()->sentence(4),
            'body' => fake()->paragraph(),
            'channels' => implode(',', fake()->randomElements(['push', 'email', 'sms', 'in_app'], fake()->numberBetween(1, 3))),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
            'metadata' => [
                'category' => fake()->randomElement(['transactional', 'marketing', 'system']),
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
            ],
        ];
    }
}
