<?php

namespace Tests\Unit\Models;

use App\Enums\MetricSource;
use App\Enums\MetricType;
use App\Models\HealthMetric;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthMetricTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_be_created_with_factory(): void
    {
        $metric = HealthMetric::factory()->create();

        $this->assertDatabaseHas('health_metrics', ['id' => $metric->id]);
    }

    public function test_casts_type_to_metric_type_enum(): void
    {
        $metric = HealthMetric::factory()->create(['type' => MetricType::HEART_RATE]);

        $this->assertInstanceOf(MetricType::class, $metric->type);
        $this->assertEquals(MetricType::HEART_RATE, $metric->type);
    }

    public function test_casts_source_to_metric_source_enum(): void
    {
        $metric = HealthMetric::factory()->create(['source' => MetricSource::USER_INPUT]);

        $this->assertInstanceOf(MetricSource::class, $metric->source);
        $this->assertEquals(MetricSource::USER_INPUT, $metric->source);
    }

    public function test_casts_value_to_float(): void
    {
        $metric = HealthMetric::factory()->create(['value' => 72]);

        $this->assertIsFloat($metric->value);
    }

    public function test_casts_is_abnormal_to_boolean(): void
    {
        $metric = HealthMetric::factory()->create(['is_abnormal' => true]);

        $this->assertIsBool($metric->is_abnormal);
        $this->assertTrue($metric->is_abnormal);
    }

    public function test_casts_metadata_to_array(): void
    {
        $meta = ['device' => 'smartwatch', 'confidence' => 0.95];
        $metric = HealthMetric::factory()->create(['metadata' => $meta]);

        $this->assertIsArray($metric->metadata);
        $this->assertEquals('smartwatch', $metric->metadata['device']);
    }

    public function test_casts_timestamp_to_datetime(): void
    {
        $metric = HealthMetric::factory()->create();

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $metric->timestamp);
    }

    public function test_user_relationship_returns_belongs_to(): void
    {
        $metric = HealthMetric::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $metric->user());
    }

    public function test_user_relationship_returns_correct_model(): void
    {
        $user = User::factory()->create();
        $metric = HealthMetric::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $metric->user);
        $this->assertEquals($user->id, $metric->user->id);
    }
}
