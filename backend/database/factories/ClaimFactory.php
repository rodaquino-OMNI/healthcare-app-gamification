<?php

namespace Database\Factories;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Claim>
 */
class ClaimFactory extends Factory
{
    public function definition(): array
    {
        $status = fake()->randomElement(ClaimStatus::cases());
        $submittedAt = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'user_id' => User::factory(),
            'plan_id' => Plan::factory(),
            'type' => fake()->randomElement(['medical', 'dental', 'vision', 'pharmacy', 'lab']),
            'amount' => fake()->randomFloat(2, 50, 15000),
            'status' => $status,
            'submitted_at' => $submittedAt,
            'approved_at' => in_array($status, [ClaimStatus::APPROVED, ClaimStatus::COMPLETED, ClaimStatus::PROCESSING]) ? fake()->dateTimeBetween($submittedAt, 'now') : null,
            'rejected_at' => $status === ClaimStatus::DENIED ? fake()->dateTimeBetween($submittedAt, 'now') : null,
            'paid_at' => $status === ClaimStatus::COMPLETED ? fake()->dateTimeBetween($submittedAt, 'now') : null,
            'processed_at' => fake()->dateTimeBetween($submittedAt, 'now'),
            'procedure_code' => fake()->bothify('???##.##'),
            'diagnosis_code' => fake()->bothify('?##.#'),
            'service_date' => fake()->dateTimeBetween('-6 months', 'now'),
            'provider_name' => fake()->company() . ' Medical',
            'provider_tax_id' => fake()->numerify('##-#######'),
            'procedure_description' => fake()->sentence(),
            'receipt_url' => fake()->optional()->url(),
            'additional_document_urls' => [],
            'status_history' => [
                [
                    'status' => 'DRAFT',
                    'timestamp' => $submittedAt->format('Y-m-d H:i:s'),
                    'note' => 'Claim created',
                ],
            ],
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
