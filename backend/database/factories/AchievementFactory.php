<?php

namespace Database\Factories;

use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Achievement>
 */
class AchievementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->words(3, true),
            'description' => fake()->sentence(),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
            'icon' => fake()->randomElement(['trophy', 'star', 'medal', 'heart', 'flame', 'shield']),
            'xp_reward' => fake()->numberBetween(10, 500),
        ];
    }
}
