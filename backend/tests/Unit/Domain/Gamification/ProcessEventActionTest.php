<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Actions\ProcessEventAction;
use App\Domain\Gamification\Rules\RuleEngine;
use Mockery;
use Tests\TestCase;

class ProcessEventActionTest extends TestCase
{
    public function test_calls_rule_engine_process_event_with_correct_structure(): void
    {
        $ruleEngine = Mockery::mock(RuleEngine::class);
        $ruleEngine->shouldReceive('processEvent')
            ->once()
            ->with([
                'user_id' => 'user-123',
                'type' => 'appointment.completed',
                'payload' => ['count' => 5],
            ]);

        $action = new ProcessEventAction($ruleEngine);
        $action->execute('user-123', 'appointment.completed', ['count' => 5]);
    }
}
