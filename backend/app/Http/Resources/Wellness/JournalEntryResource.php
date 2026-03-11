<?php

namespace App\Http\Resources\Wellness;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'mood'       => $this->mood,
            'body'       => $this->body,
            'tags'       => $this->tags,
            'created_at' => $this->created_at,
        ];
    }
}
