<?php

namespace App\Domain\Gamification\Actions;

use App\Models\GameProfile;

class AwardXpAction
{
    /**
     * Award XP to a user's game profile, handling level-ups.
     */
    public function execute(string $userId, int $amount, string $reason): void
    {
        $profile = GameProfile::firstOrCreate(
            ['user_id' => $userId],
            ['xp' => 0, 'level' => 1]
        );

        $oldLevel = $profile->level;
        $profile->xp += $amount;
        $profile->save();

        // Check level up (level = floor(xp/100) + 1)
        $newLevel = $profile->level; // Uses accessor
        if ($newLevel > $oldLevel) {
            // Could dispatch notification here
        }
    }
}
