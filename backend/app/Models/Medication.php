<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Medication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'dosage',
        'frequency',
        'start_date',
        'end_date',
        'reminder_enabled',
        'notes',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'dosage' => 'float',
            'start_date' => 'date',
            'end_date' => 'date',
            'reminder_enabled' => 'boolean',
            'active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
