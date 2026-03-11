<?php

namespace Tests\Unit\Models;

use App\Models\Benefit;
use App\Models\Claim;
use App\Models\Coverage;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $plan = Plan::factory()->create();

        $this->assertDatabaseHas('plans', ['id' => $plan->id]);
    }

    public function test_casts_validity_start_to_date(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $plan->validity_start);
    }

    public function test_casts_validity_end_to_date(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $plan->validity_end);
    }

    public function test_casts_coverage_details_to_array(): void
    {
        $details = ['medical' => true, 'dental' => false];
        $plan = Plan::factory()->create(['coverage_details' => $details]);

        $this->assertIsArray($plan->coverage_details);
        $this->assertTrue($plan->coverage_details['medical']);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $plan->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $plan->user);
        $this->assertEquals($user->id, $plan->user->id);
    }

    public function test_claims_relationship_returns_has_many(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(HasMany::class, $plan->claims());
    }

    public function test_claims_relationship_returns_correct_models(): void
    {
        $plan = Plan::factory()->create();
        Claim::factory()->count(2)->create(['plan_id' => $plan->id, 'user_id' => $plan->user_id]);

        $this->assertCount(2, $plan->claims);
        $this->assertInstanceOf(Claim::class, $plan->claims->first());
    }

    public function test_coverages_relationship_returns_has_many(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(HasMany::class, $plan->coverages());
    }

    public function test_coverages_relationship_returns_correct_models(): void
    {
        $plan = Plan::factory()->create();
        Coverage::factory()->count(3)->create(['plan_id' => $plan->id]);

        $this->assertCount(3, $plan->coverages);
        $this->assertInstanceOf(Coverage::class, $plan->coverages->first());
    }

    public function test_benefits_relationship_returns_has_many(): void
    {
        $plan = Plan::factory()->create();

        $this->assertInstanceOf(HasMany::class, $plan->benefits());
    }

    public function test_benefits_relationship_returns_correct_models(): void
    {
        $plan = Plan::factory()->create();
        Benefit::factory()->count(2)->create(['plan_id' => $plan->id]);

        $this->assertCount(2, $plan->benefits);
        $this->assertInstanceOf(Benefit::class, $plan->benefits->first());
    }
}
