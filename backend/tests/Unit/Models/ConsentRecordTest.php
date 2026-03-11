<?php

namespace Tests\Unit\Models;

use App\Enums\ConsentStatus;
use App\Enums\ConsentType;
use App\Models\ConsentRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsentRecordTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $consent = ConsentRecord::factory()->create();

        $this->assertDatabaseHas('consent_records', ['id' => $consent->id]);
    }

    public function test_casts_consent_type_to_enum(): void
    {
        $consent = ConsentRecord::factory()->create(['consent_type' => ConsentType::DATA_PROCESSING]);

        $this->assertInstanceOf(ConsentType::class, $consent->consent_type);
        $this->assertEquals(ConsentType::DATA_PROCESSING, $consent->consent_type);
    }

    public function test_casts_status_to_enum(): void
    {
        $consent = ConsentRecord::factory()->create(['status' => ConsentStatus::ACTIVE]);

        $this->assertInstanceOf(ConsentStatus::class, $consent->status);
        $this->assertEquals(ConsentStatus::ACTIVE, $consent->status);
    }

    public function test_casts_data_categories_to_array(): void
    {
        $categories = ['personal', 'health', 'financial'];
        $consent = ConsentRecord::factory()->create(['data_categories' => $categories]);

        $this->assertIsArray($consent->data_categories);
        $this->assertCount(3, $consent->data_categories);
        $this->assertContains('health', $consent->data_categories);
    }

    public function test_casts_granted_at_to_datetime(): void
    {
        $consent = ConsentRecord::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $consent->granted_at);
    }

    public function test_casts_expires_at_to_datetime(): void
    {
        $consent = ConsentRecord::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $consent->expires_at);
    }

    public function test_casts_revoked_at_to_datetime_when_set(): void
    {
        $consent = ConsentRecord::factory()->create([
            'status' => ConsentStatus::REVOKED,
            'revoked_at' => '2025-06-15 10:00:00',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $consent->revoked_at);
    }

    public function test_casts_version_to_integer(): void
    {
        $consent = ConsentRecord::factory()->create(['version' => 3]);

        $this->assertIsInt($consent->version);
        $this->assertEquals(3, $consent->version);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $consent = ConsentRecord::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $consent->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $consent = ConsentRecord::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $consent->user);
        $this->assertEquals($user->id, $consent->user->id);
    }
}
