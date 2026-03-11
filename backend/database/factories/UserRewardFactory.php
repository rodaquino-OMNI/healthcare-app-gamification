<?php

namespace Database\Factories;

use App\Models\GameProfile;
use App\Models\Reward;
use App\Models\UserReward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserReward>
 */
class UserRewardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'profile_id' => GameProfile::factory(),
            'reward_id' => Reward::factory(),
            'earned_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
