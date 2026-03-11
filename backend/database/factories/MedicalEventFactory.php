<?php

namespace Database\Factories;

use App\Models\MedicalEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicalEvent>
 */
class MedicalEventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement([
                'consultation', 'exam', 'surgery', 'vaccination',
                'hospitalization', 'emergency', 'lab_test', 'imaging',
            ]),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'provider' => fake()->name() . ', MD',
            'location' => fake()->company() . ' Medical Center',
            'date' => fake()->dateTimeBetween('-2 years', 'now'),
            'documents' => [],
            'tags' => fake()->randomElements(
                ['routine', 'urgent', 'follow-up', 'preventive', 'chronic', 'acute'],
                fake()->numberBetween(1, 3)
            ),
        ];
    }
}
