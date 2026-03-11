<?php

namespace App\Http\Resources\Care;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'dosage' => $this->dosage,
            'frequency' => $this->frequency,
            'is_active' => $this->is_active,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'instructions' => $this->instructions,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
