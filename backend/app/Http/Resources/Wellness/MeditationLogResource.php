<?php

namespace App\Http\Resources\Wellness;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeditationLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'session_id'       => $this->session_id,
            'duration_minutes' => $this->duration_minutes,
            'created_at'       => $this->created_at,
        ];
    }
}
