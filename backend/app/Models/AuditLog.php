<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'resource_type',
        'resource_id',
        'journey_id',
        'ip_address',
        'user_agent',
        'request_body',
        'response_status',
        'metadata',
        'performed_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'request_body' => 'array',
            'response_status' => 'integer',
            'metadata' => 'array',
            'performed_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }
}
