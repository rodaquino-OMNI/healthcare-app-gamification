<?php

namespace App\Http\Resources\Care;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'provider_id' => $this->provider_id,
            'type' => $this->type,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at,
            'duration_minutes' => $this->duration_minutes,
            'notes' => $this->notes,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
