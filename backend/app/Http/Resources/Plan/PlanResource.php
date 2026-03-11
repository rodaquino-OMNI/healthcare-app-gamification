<?php

namespace App\Http\Resources\Plan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'price' => $this->price,
            'is_active' => $this->is_active,
            'coverage_details' => $this->coverage_details,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
