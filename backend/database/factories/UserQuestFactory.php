<?php

namespace Database\Factories;

use App\Models\GameProfile;
use App\Models\Quest;
use App\Models\UserQuest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserQuest>
 */
class UserQuestFactory extends Factory
{
    public function definition(): array
    {
        $completed = fake()->boolean(30);

        return [
            'profile_id' => GameProfile::factory(),
            'quest_id' => Quest::factory(),
            'progress' => $completed ? 100 : fake()->numberBetween(0, 99),
            'completed' => $completed,
        ];
    }
}
