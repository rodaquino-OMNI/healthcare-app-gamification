<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'entity_id',
        'entity_type',
        'type',
        'file_path',
    ];

    /**
     * Get the parent entity (polymorphic).
     */
    public function entity(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo('entity', 'entity_type', 'entity_id');
    }
}
