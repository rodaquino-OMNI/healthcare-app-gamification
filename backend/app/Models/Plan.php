<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'plan_number',
        'type',
        'validity_start',
        'validity_end',
        'coverage_details',
        'journey',
    ];

    protected function casts(): array
    {
        return [
            'validity_start' => 'date',
            'validity_end' => 'date',
            'coverage_details' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }

    public function coverages(): HasMany
    {
        return $this->hasMany(Coverage::class);
    }

    public function benefits(): HasMany
    {
        return $this->hasMany(Benefit::class);
    }
}
