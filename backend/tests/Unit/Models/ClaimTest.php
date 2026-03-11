<?php

namespace Tests\Unit\Models;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClaimTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $claim = Claim::factory()->create();

        $this->assertDatabaseHas('claims', ['id' => $claim->id]);
    }

    public function test_casts_amount_to_decimal(): void
    {
        $claim = Claim::factory()->create(['amount' => 150.75]);

        $this->assertEquals('150.75', $claim->amount);
    }

    public function test_casts_status_to_claim_status_enum(): void
    {
        $claim = Claim::factory()->create(['status' => ClaimStatus::SUBMITTED]);

        $this->assertInstanceOf(ClaimStatus::class, $claim->status);
        $this->assertEquals(ClaimStatus::SUBMITTED, $claim->status);
    }

    public function test_casts_submitted_at_to_datetime(): void
    {
        $claim = Claim::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $claim->submitted_at);
    }

    public function test_casts_approved_at_to_datetime(): void
    {
        $claim = Claim::factory()->create([
            'status' => ClaimStatus::APPROVED,
            'approved_at' => '2025-06-15 10:00:00',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $claim->approved_at);
    }

    public function test_casts_service_date_to_date(): void
    {
        $claim = Claim::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $claim->service_date);
    }

    public function test_casts_additional_document_urls_to_array(): void
    {
        $urls = ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'];
        $claim = Claim::factory()->create(['additional_document_urls' => $urls]);

        $this->assertIsArray($claim->additional_document_urls);
        $this->assertCount(2, $claim->additional_document_urls);
    }

    public function test_casts_status_history_to_array(): void
    {
        $history = [['status' => 'DRAFT', 'timestamp' => '2025-01-01', 'note' => 'Created']];
        $claim = Claim::factory()->create(['status_history' => $history]);

        $this->assertIsArray($claim->status_history);
        $this->assertEquals('DRAFT', $claim->status_history[0]['status']);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $claim = Claim::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $claim->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $claim = Claim::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $claim->user);
        $this->assertEquals($user->id, $claim->user->id);
    }

    public function test_plan_relationship_returns_belongs_to(): void
    {
        $claim = Claim::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $claim->plan());
    }

    public function test_plan_relationship_returns_correct_model(): void
    {
        $plan = Plan::factory()->create();
        $claim = Claim::factory()->create(['plan_id' => $plan->id]);

        $this->assertInstanceOf(Plan::class, $claim->plan);
        $this->assertEquals($plan->id, $claim->plan->id);
    }
}
