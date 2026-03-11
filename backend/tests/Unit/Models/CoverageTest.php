<?php

namespace Tests\Unit\Models;

use App\Models\Coverage;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoverageTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $coverage = Coverage::factory()->create();

        $this->assertDatabaseHas('coverages', ['id' => $coverage->id]);
    }

    public function test_casts_co_payment_to_decimal(): void
    {
        $coverage = Coverage::factory()->create(['co_payment' => 50.25]);

        $this->assertEquals('50.25', $coverage->co_payment);
    }

    public function test_plan_relationship_returns_belongs_to(): void
    {
        $coverage = Coverage::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $coverage->plan());
    }

    public function test_plan_relationship_returns_correct_model(): void
    {
        $plan = Plan::factory()->create();
        $coverage = Coverage::factory()->create(['plan_id' => $plan->id]);

        $this->assertInstanceOf(Plan::class, $coverage->plan);
        $this->assertEquals($plan->id, $coverage->plan->id);
    }
}
