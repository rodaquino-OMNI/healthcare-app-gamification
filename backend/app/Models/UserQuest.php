<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserQuest extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'profile_id',
        'quest_id',
        'progress',
        'completed',
    ];

    protected function casts(): array
    {
        return [
            'progress' => 'integer',
            'completed' => 'boolean',
        ];
    }

    public function gameProfile(): BelongsTo
    {
        return $this->belongsTo(GameProfile::class, 'profile_id');
    }

    public function quest(): BelongsTo
    {
        return $this->belongsTo(Quest::class);
    }
}
