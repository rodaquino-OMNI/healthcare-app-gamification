<?php

namespace Tests\Unit\Models;

use App\Models\NotificationTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $template = NotificationTemplate::factory()->create();

        $this->assertDatabaseHas('notification_templates', ['id' => $template->id]);
    }

    public function test_casts_metadata_to_array(): void
    {
        $meta = ['category' => 'transactional', 'priority' => 'high'];
        $template = NotificationTemplate::factory()->create(['metadata' => $meta]);

        $this->assertIsArray($template->metadata);
        $this->assertEquals('transactional', $template->metadata['category']);
    }

    public function test_has_correct_fillable_fields(): void
    {
        $template = new NotificationTemplate();

        $this->assertEquals([
            'template_id',
            'language',
            'title',
            'body',
            'channels',
            'journey',
            'metadata',
        ], $template->getFillable());
    }
}
