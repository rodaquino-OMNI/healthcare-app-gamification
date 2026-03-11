<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Coverage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'plan_id',
        'type',
        'details',
        'limitations',
        'co_payment',
    ];

    protected function casts(): array
    {
        return [
            'co_payment' => 'decimal:2',
        ];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
