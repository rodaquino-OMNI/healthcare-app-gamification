<?php

namespace App\Http\Resources\Health;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthMetricResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'value' => $this->value,
            'unit' => $this->unit,
            'source' => $this->source,
            'recorded_at' => $this->recorded_at,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
