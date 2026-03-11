<?php

namespace Database\Factories;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\UserAchievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserAchievement>
 */
class UserAchievementFactory extends Factory
{
    public function definition(): array
    {
        $unlocked = fake()->boolean(40);

        return [
            'profile_id' => GameProfile::factory(),
            'achievement_id' => Achievement::factory(),
            'progress' => $unlocked ? 100 : fake()->numberBetween(0, 99),
            'unlocked' => $unlocked,
            'unlocked_at' => $unlocked ? fake()->dateTimeBetween('-6 months', 'now') : null,
        ];
    }
}
