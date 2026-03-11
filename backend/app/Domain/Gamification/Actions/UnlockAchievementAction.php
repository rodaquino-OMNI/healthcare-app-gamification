<?php

namespace App\Domain\Gamification\Actions;

use App\Models\Achievement;
use App\Models\GameProfile;
use App\Models\UserAchievement;

class UnlockAchievementAction
{
    /**
     * Unlock an achievement for a user.
     */
    public function execute(string $userId, string $achievementId): void
    {
        $profile = GameProfile::where('user_id', $userId)->firstOrFail();
        $achievement = Achievement::findOrFail($achievementId);

        $existing = UserAchievement::where('profile_id', $profile->id)
            ->where('achievement_id', $achievementId)
            ->first();

        if ($existing) {
            return; // Already unlocked
        }

        UserAchievement::create([
            'profile_id' => $profile->id,
            'achievement_id' => $achievementId,
            'progress' => 100,
            'unlocked' => true,
            'unlocked_at' => now(),
        ]);

        // Award XP from achievement
        if ($achievement->xp_reward > 0) {
            $profile->xp += $achievement->xp_reward;
            $profile->save();
        }
    }
}
