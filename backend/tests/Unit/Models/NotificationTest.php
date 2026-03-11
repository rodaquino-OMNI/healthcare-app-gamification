<?php

namespace Tests\Unit\Models;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $notification = Notification::factory()->create();

        $this->assertDatabaseHas('notifications', ['id' => $notification->id]);
    }

    public function test_casts_metadata_to_array(): void
    {
        $meta = ['priority' => 'high', 'source' => 'system'];
        $notification = Notification::factory()->create(['metadata' => $meta]);

        $this->assertIsArray($notification->metadata);
        $this->assertEquals('high', $notification->metadata['priority']);
    }

    public function test_casts_points_to_integer(): void
    {
        $notification = Notification::factory()->create(['points' => 100]);

        $this->assertIsInt($notification->points);
        $this->assertEquals(100, $notification->points);
    }

    public function test_casts_level_to_integer(): void
    {
        $notification = Notification::factory()->create(['level' => 5]);

        $this->assertIsInt($notification->level);
        $this->assertEquals(5, $notification->level);
    }

    public function test_casts_points_earned_to_integer(): void
    {
        $notification = Notification::factory()->create(['points_earned' => 50]);

        $this->assertIsInt($notification->points_earned);
        $this->assertEquals(50, $notification->points_earned);
    }

    public function test_casts_new_level_to_integer(): void
    {
        $notification = Notification::factory()->create(['new_level' => 10]);

        $this->assertIsInt($notification->new_level);
        $this->assertEquals(10, $notification->new_level);
    }

    public function test_casts_show_celebration_to_boolean(): void
    {
        $notification = Notification::factory()->create(['show_celebration' => true]);

        $this->assertIsBool($notification->show_celebration);
        $this->assertTrue($notification->show_celebration);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $notification = Notification::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $notification->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $notification->user);
        $this->assertEquals($user->id, $notification->user->id);
    }
}
