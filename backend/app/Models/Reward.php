<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reward extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'title',
        'description',
        'xp_reward',
        'icon',
        'journey',
    ];

    protected function casts(): array
    {
        return [
            'xp_reward' => 'integer',
        ];
    }

    public function userRewards(): HasMany
    {
        return $this->hasMany(UserReward::class);
    }
}
