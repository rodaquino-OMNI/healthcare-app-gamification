<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReward extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'reward_id',
        'earned_at',
    ];

    protected function casts(): array
    {
        return [
            'earned_at' => 'datetime',
        ];
    }

    public function gameProfile(): BelongsTo
    {
        return $this->belongsTo(GameProfile::class, 'profile_id');
    }

    public function reward(): BelongsTo
    {
        return $this->belongsTo(Reward::class);
    }
}
