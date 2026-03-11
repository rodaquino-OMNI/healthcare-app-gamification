<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAchievement extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $primaryKey = ['profile_id', 'achievement_id'];

    protected $fillable = [
        'profile_id',
        'achievement_id',
        'progress',
        'unlocked',
        'acknowledged',
        'unlocked_at',
    ];

    protected function casts(): array
    {
        return [
            'progress' => 'integer',
            'unlocked' => 'boolean',
            'acknowledged' => 'boolean',
            'unlocked_at' => 'datetime',
        ];
    }

    /**
     * Set the keys for a save update query.
     */
    protected function setKeysForSaveQuery($query)
    {
        $query->where('profile_id', $this->getAttribute('profile_id'))
              ->where('achievement_id', $this->getAttribute('achievement_id'));

        return $query;
    }

    public function getKeyType()
    {
        return 'string';
    }

    public function gameProfile(): BelongsTo
    {
        return $this->belongsTo(GameProfile::class, 'profile_id');
    }

    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }
}
