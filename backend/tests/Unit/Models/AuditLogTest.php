<?php

namespace Tests\Unit\Models;

use App\Models\AuditLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $log = AuditLog::factory()->create();

        $this->assertDatabaseHas('audit_logs', ['id' => $log->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $log = new AuditLog();

        $this->assertFalse($log->usesTimestamps());
    }

    public function test_casts_metadata_to_array(): void
    {
        $meta = ['browser' => 'Chrome', 'os' => 'Windows'];
        $log = AuditLog::factory()->create(['metadata' => $meta]);

        $this->assertIsArray($log->metadata);
        $this->assertEquals('Chrome', $log->metadata['browser']);
    }

    public function test_casts_created_at_to_datetime(): void
    {
        $log = AuditLog::factory()->create(['created_at' => '2025-06-15 10:00:00']);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $log->created_at);
    }

    public function test_has_correct_fillable_fields(): void
    {
        $log = new AuditLog();

        $this->assertEquals([
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
        ], $log->getFillable());
    }
}
