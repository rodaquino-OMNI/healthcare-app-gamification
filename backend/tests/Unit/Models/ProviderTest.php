<?php

namespace Tests\Unit\Models;

use App\Models\Appointment;
use App\Models\Provider;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $provider = Provider::factory()->create();

        $this->assertDatabaseHas('providers', ['id' => $provider->id]);
    }

    public function test_casts_telemedicine_available_to_boolean(): void
    {
        $provider = Provider::factory()->create(['telemedicine_available' => true]);

        $this->assertIsBool($provider->telemedicine_available);
        $this->assertTrue($provider->telemedicine_available);
    }

    public function test_appointments_relationship_returns_has_many(): void
    {
        $provider = Provider::factory()->create();

        $this->assertInstanceOf(HasMany::class, $provider->appointments());
    }

    public function test_appointments_relationship_returns_correct_models(): void
    {
        $provider = Provider::factory()->create();
        Appointment::factory()->count(3)->create(['provider_id' => $provider->id]);

        $this->assertCount(3, $provider->appointments);
        $this->assertInstanceOf(Appointment::class, $provider->appointments->first());
    }
}
