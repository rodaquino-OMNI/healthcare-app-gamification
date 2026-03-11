<?php

namespace App\Jobs;

use App\Domain\Gamification\Actions\ProcessEventAction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessGamificationEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public readonly string $userId,
        public readonly string $eventType,
        public readonly array $payload,
    ) {}

    public function handle(ProcessEventAction $action): void
    {
        $action->execute($this->userId, $this->eventType, $this->payload);
    }
}
