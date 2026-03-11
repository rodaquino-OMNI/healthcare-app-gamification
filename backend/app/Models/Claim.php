<?php

namespace App\Models;

use App\Enums\ClaimStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'plan_id',
        'type',
        'amount',
        'status',
        'submitted_at',
        'approved_at',
        'rejected_at',
        'paid_at',
        'processed_at',
        'procedure_code',
        'diagnosis_code',
        'service_date',
        'provider_name',
        'provider_tax_id',
        'procedure_description',
        'receipt_url',
        'additional_document_urls',
        'status_history',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => ClaimStatus::class,
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'paid_at' => 'datetime',
            'processed_at' => 'datetime',
            'service_date' => 'date',
            'additional_document_urls' => 'array',
            'status_history' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
