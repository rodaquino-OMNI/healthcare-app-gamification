<?php

namespace Database\Factories;

use App\Models\Quest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quest>
 */
class QuestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->words(3, true),
            'description' => fake()->sentence(),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
            'icon' => fake()->randomElement(['compass', 'map', 'flag', 'target', 'rocket', 'lightning']),
            'xp_reward' => fake()->numberBetween(25, 1000),
        ];
    }
}
