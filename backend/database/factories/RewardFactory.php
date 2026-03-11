<?php

namespace Database\Factories;

use App\Models\Reward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reward>
 */
class RewardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->words(3, true),
            'description' => fake()->sentence(),
            'xp_reward' => fake()->numberBetween(50, 500),
            'icon' => fake()->randomElement(['gift', 'crown', 'diamond', 'coin', 'chest', 'gem']),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
        ];
    }
}
