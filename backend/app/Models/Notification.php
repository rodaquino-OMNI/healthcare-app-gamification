<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'channel',
        'status',
        'journey',
        'metadata',
        'achievement_id',
        'points',
        'badge_id',
        'level',
        'gamification_event_type',
        'points_earned',
        'new_level',
        'show_celebration',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'points' => 'integer',
            'level' => 'integer',
            'points_earned' => 'integer',
            'new_level' => 'integer',
            'show_celebration' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
