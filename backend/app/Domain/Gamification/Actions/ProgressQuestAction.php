<?php

namespace App\Domain\Gamification\Actions;

use App\Models\GameProfile;
use App\Models\UserQuest;

class ProgressQuestAction
{
    /**
     * Progress a quest task for a user.
     */
    public function execute(string $userId, string $questId, string $taskId): void
    {
        $profile = GameProfile::where('user_id', $userId)->firstOrFail();
        $userQuest = UserQuest::where('profile_id', $profile->id)
            ->where('quest_id', $questId)
            ->firstOrFail();

        $userQuest->progress = min($userQuest->progress + 1, 100);
        if ($userQuest->progress >= 100) {
            $userQuest->completed = true;
        }
        $userQuest->save();
    }
}
