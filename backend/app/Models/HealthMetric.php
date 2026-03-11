<?php

namespace App\Models;

use App\Enums\MetricSource;
use App\Enums\MetricType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthMetric extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'type',
        'value',
        'unit',
        'timestamp',
        'source',
        'notes',
        'trend',
        'is_abnormal',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type' => MetricType::class,
            'source' => MetricSource::class,
            'value' => 'float',
            'timestamp' => 'datetime',
            'trend' => 'float',
            'is_abnormal' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
