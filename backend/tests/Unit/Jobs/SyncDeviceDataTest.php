<?php

namespace Tests\Unit\Jobs;

use App\Jobs\SyncDeviceData;
use App\Models\DeviceConnection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SyncDeviceDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_has_correct_tries_and_backoff(): void
    {
        $device = DeviceConnection::factory()->create();
        $job = new SyncDeviceData($device);

        $this->assertEquals(3, $job->tries);
        $this->assertEquals(60, $job->backoff);
    }

    public function test_job_implements_should_queue(): void
    {
        $device = DeviceConnection::factory()->create();
        $job = new SyncDeviceData($device);

        $this->assertInstanceOf(ShouldQueue::class, $job);
    }

    public function test_job_accepts_device_connection_in_constructor(): void
    {
        $device = DeviceConnection::factory()->create();
        $job = new SyncDeviceData($device);

        $this->assertEquals($device->id, $job->deviceConnection->id);
    }
}
