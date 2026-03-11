<?php

namespace App\Http\Resources\Gamification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'level' => $this->level,
            'xp' => $this->xp,
            'total_points' => $this->total_points,
            'streak_days' => $this->streak_days,
            'longest_streak' => $this->longest_streak,
            'achievements_count' => $this->achievements_count,
            'quests_completed' => $this->quests_completed,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
