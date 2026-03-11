<?php

namespace Tests\Unit\Models;

use App\Enums\GoalPeriod;
use App\Enums\GoalStatus;
use App\Enums\GoalType;
use App\Models\HealthGoal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthGoalTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $goal = HealthGoal::factory()->create();

        $this->assertDatabaseHas('health_goals', ['id' => $goal->id]);
    }

    public function test_casts_type_to_goal_type_enum(): void
    {
        $goal = HealthGoal::factory()->create(['type' => GoalType::STEPS]);

        $this->assertInstanceOf(GoalType::class, $goal->type);
        $this->assertEquals(GoalType::STEPS, $goal->type);
    }

    public function test_casts_status_to_goal_status_enum(): void
    {
        $goal = HealthGoal::factory()->create(['status' => GoalStatus::ACTIVE]);

        $this->assertInstanceOf(GoalStatus::class, $goal->status);
        $this->assertEquals(GoalStatus::ACTIVE, $goal->status);
    }

    public function test_casts_period_to_goal_period_enum(): void
    {
        $goal = HealthGoal::factory()->create(['period' => GoalPeriod::DAILY]);

        $this->assertInstanceOf(GoalPeriod::class, $goal->period);
        $this->assertEquals(GoalPeriod::DAILY, $goal->period);
    }

    public function test_casts_target_value_to_float(): void
    {
        $goal = HealthGoal::factory()->create(['target_value' => 10000]);

        $this->assertIsFloat($goal->target_value);
    }

    public function test_casts_current_value_to_float(): void
    {
        $goal = HealthGoal::factory()->create(['current_value' => 5000]);

        $this->assertIsFloat($goal->current_value);
    }

    public function test_casts_start_date_to_date(): void
    {
        $goal = HealthGoal::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $goal->start_date);
    }

    public function test_casts_end_date_to_date(): void
    {
        $goal = HealthGoal::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $goal->end_date);
    }

    public function test_casts_completed_date_to_date_when_set(): void
    {
        $goal = HealthGoal::factory()->create([
            'status' => GoalStatus::COMPLETED,
            'completed_date' => '2025-06-15',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $goal->completed_date);
    }

    public function test_completed_date_is_null_when_not_completed(): void
    {
        $goal = HealthGoal::factory()->create([
            'status' => GoalStatus::ACTIVE,
            'completed_date' => null,
        ]);

        $this->assertNull($goal->completed_date);
    }
}
