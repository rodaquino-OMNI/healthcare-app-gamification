<?php

namespace App\Http\Resources\Gamification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AchievementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'category' => $this->category,
            'xp_reward' => $this->xp_reward,
            'points_reward' => $this->points_reward,
            'is_hidden' => $this->is_hidden,
            'criteria' => $this->criteria,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
