<?php

namespace Database\Factories;

use App\Enums\MetricSource;
use App\Enums\MetricType;
use App\Models\HealthMetric;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HealthMetric>
 */
class HealthMetricFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(MetricType::cases()),
            'value' => fake()->randomFloat(2, 0, 10000),
            'unit' => fake()->randomElement(['steps', 'bpm', 'kg', 'mg/dL', 'mmHg', 'hours', 'kcal']),
            'timestamp' => fake()->dateTimeBetween('-30 days', 'now'),
            'source' => fake()->randomElement(MetricSource::cases()),
            'notes' => fake()->optional()->sentence(),
            'trend' => fake()->optional()->randomFloat(2, -10, 10),
            'is_abnormal' => fake()->boolean(10),
            'metadata' => [
                'device' => fake()->randomElement(['smartwatch', 'phone', 'manual']),
                'confidence' => fake()->randomFloat(2, 0.8, 1.0),
            ],
        ];
    }
}
