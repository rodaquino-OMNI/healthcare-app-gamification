<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Actions\AwardXpAction;
use App\Domain\Gamification\Actions\UnlockAchievementAction;
use App\Domain\Gamification\Rules\RuleEngine;
use App\Models\GameProfile;
use App\Models\Rule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class RuleEngineTest extends TestCase
{
    use RefreshDatabase;

    private RuleEngine $engine;

    protected function setUp(): void
    {
        parent::setUp();
        $this->engine = new RuleEngine();
    }

    public function test_load_rules_returns_all_rules_from_database(): void
    {
        Rule::factory()->count(3)->create();

        Cache::flush();
        $rules = $this->engine->loadRules();

        $this->assertCount(3, $rules);
    }

    public function test_load_rules_caches_results(): void
    {
        Rule::factory()->count(2)->create();

        Cache::flush();
        $firstCall = $this->engine->loadRules();

        // Create more rules after caching
        Rule::factory()->count(3)->create();

        $secondCall = $this->engine->loadRules();

        // Should still return cached result (2 rules, not 5)
        $this->assertCount(2, $secondCall);
    }

    public function test_process_event_evaluates_matching_rules(): void
    {
        $user = User::factory()->create();
        GameProfile::factory()->create(['user_id' => $user->id, 'xp' => 0]);

        Rule::factory()->create([
            'event' => 'appointment.completed',
            'condition' => '',
            'actions' => [],
        ]);

        Cache::flush();
        // Should not throw any exceptions
        $this->engine->processEvent([
            'user_id' => $user->id,
            'type' => 'appointment.completed',
            'payload' => [],
        ]);

        $this->assertTrue(true); // Passes if no exception
    }

    public function test_evaluate_rule_returns_true_when_event_type_matches_and_condition_passes(): void
    {
        $rule = new Rule([
            'event' => 'steps.target_reached',
            'condition' => 'count >= 5',
            'actions' => [],
        ]);

        $profile = new GameProfile(['xp' => 100, 'level' => 2]);

        $result = $this->engine->evaluateRule($rule, [
            'type' => 'steps.target_reached',
            'payload' => ['count' => 10],
        ], $profile);

        $this->assertTrue($result);
    }

    public function test_evaluate_rule_returns_false_when_event_type_does_not_match(): void
    {
        $rule = new Rule([
            'event' => 'steps.target_reached',
            'condition' => 'count >= 5',
            'actions' => [],
        ]);

        $profile = new GameProfile(['xp' => 100, 'level' => 2]);

        $result = $this->engine->evaluateRule($rule, [
            'type' => 'appointment.completed',
            'payload' => ['count' => 10],
        ], $profile);

        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_gte_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '10 >= 5'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '3 >= 5'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_lte_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '5 <= 10'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '15 <= 10'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_eq_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '5 == 5'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '5 == 10'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_neq_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '5 != 10'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '5 != 5'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_gt_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '10 > 5'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '5 > 5'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_handles_lt_operator(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => '3 < 5'],
            []
        );
        $this->assertTrue($result);

        $result = $this->engine->evaluateCondition(
            ['expression' => '5 < 5'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_evaluate_condition_returns_false_for_invalid_expression(): void
    {
        $result = $this->engine->evaluateCondition(
            ['expression' => 'not a valid expression'],
            []
        );
        $this->assertFalse($result);
    }

    public function test_execute_action_dispatches_award_xp_action(): void
    {
        $mock = Mockery::mock(AwardXpAction::class);
        $mock->shouldReceive('execute')
            ->once()
            ->with('user-123', 50, 'bonus');

        $this->app->instance(AwardXpAction::class, $mock);

        $this->engine->executeAction([
            'type' => 'AWARD_XP',
            'amount' => 50,
            'reason' => 'bonus',
        ], 'user-123');
    }

    public function test_execute_action_dispatches_unlock_achievement_action(): void
    {
        $mock = Mockery::mock(UnlockAchievementAction::class);
        $mock->shouldReceive('execute')
            ->once()
            ->with('user-123', 'achievement-456');

        $this->app->instance(UnlockAchievementAction::class, $mock);

        $this->engine->executeAction([
            'type' => 'UNLOCK_ACHIEVEMENT',
            'achievement_id' => 'achievement-456',
        ], 'user-123');
    }

    public function test_execute_action_handles_unknown_action_types_gracefully(): void
    {
        // Should not throw any exceptions
        $this->engine->executeAction([
            'type' => 'UNKNOWN_ACTION',
        ], 'user-123');

        $this->assertTrue(true);
    }
}
