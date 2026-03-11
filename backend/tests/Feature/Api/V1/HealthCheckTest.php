<?php

namespace Tests\Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_check_returns_ok(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJson(['status' => 'ok'])
            ->assertJsonStructure(['status', 'version']);
    }

    public function test_health_check_does_not_require_auth(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200);
    }
}
