<?php

namespace Tests\Unit\Models;

use App\Models\Rule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $rule = Rule::factory()->create();

        $this->assertDatabaseHas('rules', ['id' => $rule->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $rule = new Rule();

        $this->assertFalse($rule->usesTimestamps());
    }

    public function test_casts_actions_to_array(): void
    {
        $actions = [
            ['type' => 'grant_xp', 'value' => 100],
            ['type' => 'send_notification', 'value' => 1],
        ];
        $rule = Rule::factory()->create(['actions' => $actions]);

        $this->assertIsArray($rule->actions);
        $this->assertCount(2, $rule->actions);
        $this->assertEquals('grant_xp', $rule->actions[0]['type']);
    }

    public function test_has_correct_fillable_fields(): void
    {
        $rule = new Rule();

        $this->assertEquals(['event', 'condition', 'actions'], $rule->getFillable());
    }
}
