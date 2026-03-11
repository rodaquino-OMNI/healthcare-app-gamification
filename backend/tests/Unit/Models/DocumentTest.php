<?php

namespace Tests\Unit\Models;

use App\Models\Document;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $document = Document::factory()->create();

        $this->assertDatabaseHas('documents', ['id' => $document->id]);
    }

    public function test_has_correct_fillable_fields(): void
    {
        $document = new Document();

        $this->assertEquals([
            'entity_id',
            'entity_type',
            'type',
            'file_path',
        ], $document->getFillable());
    }

    public function test_entity_relationship_returns_morph_to(): void
    {
        $document = Document::factory()->create();

        $this->assertInstanceOf(MorphTo::class, $document->entity());
    }
}
