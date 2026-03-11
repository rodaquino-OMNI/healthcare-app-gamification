<?php

namespace Tests\Unit\Models;

use App\Models\MedicalEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicalEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $event = MedicalEvent::factory()->create();

        $this->assertDatabaseHas('medical_events', ['id' => $event->id]);
    }

    public function test_casts_date_to_date(): void
    {
        $event = MedicalEvent::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $event->date);
    }

    public function test_casts_documents_to_array(): void
    {
        $docs = ['doc1.pdf', 'doc2.pdf'];
        $event = MedicalEvent::factory()->create(['documents' => $docs]);

        $this->assertIsArray($event->documents);
        $this->assertCount(2, $event->documents);
    }

    public function test_casts_tags_to_array(): void
    {
        $tags = ['routine', 'follow-up'];
        $event = MedicalEvent::factory()->create(['tags' => $tags]);

        $this->assertIsArray($event->tags);
        $this->assertContains('routine', $event->tags);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $event = MedicalEvent::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $event->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $event = MedicalEvent::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $event->user);
        $this->assertEquals($user->id, $event->user->id);
    }
}
