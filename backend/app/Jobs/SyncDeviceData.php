<?php

namespace App\Jobs;

use App\Models\DeviceConnection;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncDeviceData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly DeviceConnection $deviceConnection,
    ) {}

    public function handle(): void
    {
        // TODO: Fetch data from device API, create HealthMetric records, update last_synced_at
    }
}
