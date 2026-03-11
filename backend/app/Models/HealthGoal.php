<?php

namespace App\Models;

use App\Enums\GoalPeriod;
use App\Enums\GoalStatus;
use App\Enums\GoalType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthGoal extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'record_id',
        'type',
        'title',
        'description',
        'target_value',
        'unit',
        'current_value',
        'status',
        'period',
        'start_date',
        'end_date',
        'completed_date',
    ];

    protected function casts(): array
    {
        return [
            'type' => GoalType::class,
            'status' => GoalStatus::class,
            'period' => GoalPeriod::class,
            'target_value' => 'float',
            'current_value' => 'float',
            'start_date' => 'date',
            'end_date' => 'date',
            'completed_date' => 'date',
        ];
    }
}
