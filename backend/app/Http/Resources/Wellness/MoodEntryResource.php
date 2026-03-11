<?php

namespace App\Http\Resources\Wellness;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MoodEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'mood'       => $this->mood,
            'note'       => $this->note,
            'created_at' => $this->created_at,
        ];
    }
}
