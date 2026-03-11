<?php

namespace App\Domain\Gamification\Actions;

use App\Domain\Gamification\Rules\RuleEngine;

class ProcessEventAction
{
    public function __construct(
        private readonly RuleEngine $ruleEngine,
    ) {}

    /**
     * Process a gamification event through the rule engine.
     */
    public function execute(string $userId, string $eventType, array $payload): void
    {
        $this->ruleEngine->processEvent([
            'user_id' => $userId,
            'type' => $eventType,
            'payload' => $payload,
        ]);
    }
}
