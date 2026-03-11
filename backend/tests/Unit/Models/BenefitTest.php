<?php

namespace Tests\Unit\Models;

use App\Models\Benefit;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BenefitTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $benefit = Benefit::factory()->create();

        $this->assertDatabaseHas('benefits', ['id' => $benefit->id]);
    }

    public function test_timestamps_are_disabled(): void
    {
        $benefit = new Benefit();

        $this->assertFalse($benefit->usesTimestamps());
    }

    public function test_has_correct_fillable_fields(): void
    {
        $benefit = new Benefit();

        $this->assertEquals([
            'plan_id',
            'type',
            'description',
            'limitations',
            'usage',
        ], $benefit->getFillable());
    }

    public function test_plan_relationship_returns_belongs_to(): void
    {
        $benefit = Benefit::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $benefit->plan());
    }

    public function test_plan_relationship_returns_correct_model(): void
    {
        $plan = Plan::factory()->create();
        $benefit = Benefit::factory()->create(['plan_id' => $plan->id]);

        $this->assertInstanceOf(Plan::class, $benefit->plan);
        $this->assertEquals($plan->id, $benefit->plan->id);
    }
}
