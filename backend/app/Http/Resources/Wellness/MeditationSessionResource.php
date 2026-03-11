<?php

namespace App\Http\Resources\Wellness;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeditationSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'category'         => $this->category,
            'duration_minutes' => $this->duration_minutes,
            'description'      => $this->description,
        ];
    }
}
