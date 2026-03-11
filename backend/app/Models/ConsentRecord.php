<?php

namespace App\Models;

use App\Enums\ConsentStatus;
use App\Enums\ConsentType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsentRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'consent_type',
        'status',
        'purpose',
        'data_categories',
        'granted_at',
        'expires_at',
        'revoked_at',
        'ip_address',
        'user_agent',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'consent_type' => ConsentType::class,
            'status' => ConsentStatus::class,
            'data_categories' => 'array',
            'granted_at' => 'datetime',
            'expires_at' => 'datetime',
            'revoked_at' => 'datetime',
            'version' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
