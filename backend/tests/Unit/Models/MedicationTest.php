<?php

namespace Tests\Unit\Models;

use App\Models\Medication;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $medication = Medication::factory()->create();

        $this->assertDatabaseHas('medications', ['id' => $medication->id]);
    }

    public function test_casts_dosage_to_float(): void
    {
        $medication = Medication::factory()->create(['dosage' => 250]);

        $this->assertIsFloat($medication->dosage);
    }

    public function test_casts_start_date_to_date(): void
    {
        $medication = Medication::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $medication->start_date);
    }

    public function test_casts_end_date_to_date(): void
    {
        $medication = Medication::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $medication->end_date);
    }

    public function test_casts_reminder_enabled_to_boolean(): void
    {
        $medication = Medication::factory()->create(['reminder_enabled' => true]);

        $this->assertIsBool($medication->reminder_enabled);
        $this->assertTrue($medication->reminder_enabled);
    }

    public function test_casts_active_to_boolean(): void
    {
        $medication = Medication::factory()->create(['active' => false]);

        $this->assertIsBool($medication->active);
        $this->assertFalse($medication->active);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $medication = Medication::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $medication->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $medication->user);
        $this->assertEquals($user->id, $medication->user->id);
    }
}
