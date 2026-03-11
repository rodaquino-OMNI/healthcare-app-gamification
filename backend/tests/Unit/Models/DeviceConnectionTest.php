<?php

namespace Tests\Unit\Models;

use App\Enums\DeviceConnectionStatus;
use App\Enums\DeviceType;
use App\Models\DeviceConnection;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeviceConnectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $dc = DeviceConnection::factory()->create();

        $this->assertDatabaseHas('device_connections', ['id' => $dc->id]);
    }

    public function test_casts_device_type_to_enum(): void
    {
        $dc = DeviceConnection::factory()->create(['device_type' => DeviceType::FITBIT]);

        $this->assertInstanceOf(DeviceType::class, $dc->device_type);
        $this->assertEquals(DeviceType::FITBIT, $dc->device_type);
    }

    public function test_casts_status_to_enum(): void
    {
        $dc = DeviceConnection::factory()->create(['status' => DeviceConnectionStatus::CONNECTED]);

        $this->assertInstanceOf(DeviceConnectionStatus::class, $dc->status);
        $this->assertEquals(DeviceConnectionStatus::CONNECTED, $dc->status);
    }

    public function test_casts_last_sync_to_datetime(): void
    {
        $dc = DeviceConnection::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $dc->last_sync);
    }

    public function test_casts_token_expiry_to_datetime(): void
    {
        $dc = DeviceConnection::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $dc->token_expiry);
    }

    public function test_casts_metadata_to_array(): void
    {
        $meta = ['firmware_version' => '1.0.0', 'battery_level' => 85];
        $dc = DeviceConnection::factory()->create(['metadata' => $meta]);

        $this->assertIsArray($dc->metadata);
        $this->assertEquals('1.0.0', $dc->metadata['firmware_version']);
    }

    public function test_auth_token_is_encrypted(): void
    {
        $dc = DeviceConnection::factory()->create(['auth_token' => 'my-secret-token']);

        // The raw DB value should differ from the plain text
        $raw = \Illuminate\Support\Facades\DB::table('device_connections')
            ->where('id', $dc->id)
            ->value('auth_token');

        $this->assertNotEquals('my-secret-token', $raw);
        // But the model should decrypt it back
        $this->assertEquals('my-secret-token', $dc->fresh()->auth_token);
    }

    public function test_refresh_token_is_encrypted(): void
    {
        $dc = DeviceConnection::factory()->create(['refresh_token' => 'my-refresh-secret']);

        $raw = \Illuminate\Support\Facades\DB::table('device_connections')
            ->where('id', $dc->id)
            ->value('refresh_token');

        $this->assertNotEquals('my-refresh-secret', $raw);
        $this->assertEquals('my-refresh-secret', $dc->fresh()->refresh_token);
    }

    public function test_hidden_fields_exclude_auth_token_and_refresh_token(): void
    {
        $dc = DeviceConnection::factory()->create();
        $array = $dc->toArray();

        $this->assertArrayNotHasKey('auth_token', $array);
        $this->assertArrayNotHasKey('refresh_token', $array);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $dc = DeviceConnection::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $dc->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $dc = DeviceConnection::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $dc->user);
        $this->assertEquals($user->id, $dc->user->id);
    }
}
