<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'provider_id',
        'date_time',
        'type',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_time' => 'datetime',
            'type' => AppointmentType::class,
            'status' => AppointmentStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function telemedicineSessions(): HasMany
    {
        return $this->hasMany(TelemedicineSession::class);
    }
}
