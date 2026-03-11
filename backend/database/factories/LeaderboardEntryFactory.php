<?php

namespace Database\Factories;

use App\Models\LeaderboardEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeaderboardEntry>
 */
class LeaderboardEntryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'journey' => fake()->randomElement(['health', 'care', 'wellness']),
            'score' => fake()->numberBetween(0, 10000),
            'rank' => fake()->numberBetween(1, 500),
        ];
    }
}
