<?php

namespace Database\Factories;

use App\Models\GameProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameProfile>
 */
class GameProfileFactory extends Factory
{
    public function definition(): array
    {
        $xp = fake()->numberBetween(0, 5000);

        return [
            'user_id' => User::factory(),
            'level' => (int) floor($xp / 100) + 1,
            'xp' => $xp,
        ];
    }
}
