<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->jobTitle(),
            'description' => fake()->sentence(),
            'journey' => fake()->optional()->randomElement(['health', 'care', 'wellness']),
            'is_default' => fake()->boolean(20),
        ];
    }
}
