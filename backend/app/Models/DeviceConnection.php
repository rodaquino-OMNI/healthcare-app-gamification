<?php

namespace App\Models;

use App\Enums\DeviceConnectionStatus;
use App\Enums\DeviceType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceConnection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'record_id',
        'device_type',
        'device_id',
        'status',
        'last_sync',
        'auth_token',
        'refresh_token',
        'token_expiry',
        'metadata',
    ];

    protected $hidden = [
        'auth_token',
        'refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'device_type' => DeviceType::class,
            'status' => DeviceConnectionStatus::class,
            'last_sync' => 'datetime',
            'auth_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'token_expiry' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
