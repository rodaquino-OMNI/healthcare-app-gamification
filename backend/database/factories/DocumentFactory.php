<?php

namespace Database\Factories;

use App\Models\Claim;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'entity_id' => Claim::factory(),
            'entity_type' => 'App\\Models\\Claim',
            'type' => fake()->randomElement([
                'receipt', 'prescription', 'lab_result', 'referral',
                'medical_report', 'imaging', 'insurance_card', 'id_document',
            ]),
            'file_path' => 'documents/' . fake()->uuid() . '.' . fake()->randomElement(['pdf', 'jpg', 'png']),
        ];
    }
}
