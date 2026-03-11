<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'level',
        'xp',
    ];

    protected function casts(): array
    {
        return [
            'level' => 'integer',
            'xp' => 'integer',
        ];
    }

    public function getLevelAttribute(): int
    {
        return (int) floor($this->xp / 100) + 1;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class, 'profile_id');
    }

    public function userQuests(): HasMany
    {
        return $this->hasMany(UserQuest::class, 'profile_id');
    }

    public function userRewards(): HasMany
    {
        return $this->hasMany(UserReward::class, 'profile_id');
    }
}
