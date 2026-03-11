<?php

namespace Tests\Unit\Models;

use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TreatmentPlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $tp = TreatmentPlan::factory()->create();

        $this->assertDatabaseHas('treatment_plans', ['id' => $tp->id]);
    }

    public function test_casts_start_date_to_date(): void
    {
        $tp = TreatmentPlan::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $tp->start_date);
    }

    public function test_casts_end_date_to_date(): void
    {
        $tp = TreatmentPlan::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $tp->end_date);
    }

    public function test_casts_progress_to_float(): void
    {
        $tp = TreatmentPlan::factory()->create(['progress' => 75.5]);

        $this->assertIsFloat($tp->progress);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $tp = TreatmentPlan::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $tp->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $tp = TreatmentPlan::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $tp->user);
        $this->assertEquals($user->id, $tp->user->id);
    }
}
