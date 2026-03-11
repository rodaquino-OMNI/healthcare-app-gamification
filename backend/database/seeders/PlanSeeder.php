<?php

namespace Database\Seeders;

use App\Enums\ClaimStatus;
use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $user = DB::table('users')->where('email', 'flutter2@test.com')->first();

        if (! $user) {
            $this->command->warn('PlanSeeder: flutter2@test.com not found — run UserSeeder first.');
            return;
        }

        $userId = $user->id;
        $now    = now();
        $year   = now()->year;

        // ── Plan ───────────────────────────────────────────────────────────────

        // Remove existing plan for idempotency
        $existingPlan = DB::table('plans')
            ->where('user_id', $userId)
            ->where('plan_number', 'AUSTA-2024-001')
            ->first();

        if ($existingPlan) {
            $plan = $existingPlan;
        } else {
            $plan = Plan::create([
                'user_id'          => $userId,
                'plan_number'      => 'AUSTA-2024-001',
                'type'             => 'INDIVIDUAL',
                'validity_start'   => "{$year}-01-01",
                'validity_end'     => "{$year}-12-31",
                'coverage_details' => [
                    'hospital'    => true,
                    'ambulatorio' => true,
                    'exames'      => true,
                    'urgencia'    => true,
                ],
                'journey' => 'plan',
            ]);
        }

        $planId = $plan->id ?? $plan->id;

        // ── Coverages ──────────────────────────────────────────────────────────
        // coverage columns: id, plan_id, type, details, limitations, co_payment, created_at, updated_at
        // Note: the DB schema differs from the spec (no limit_amount/used_amount).
        // We map: service_type → type, description + amounts → details.

        $coverages = [
            [
                'type'        => 'CONSULTA',
                'details'     => 'Consultas com médicos especialistas credenciados. Limite: R$ 5.000,00 | Utilizado: R$ 850,00',
                'limitations' => 'Válido apenas para médicos da rede credenciada',
                'co_payment'  => 0.00,
            ],
            [
                'type'        => 'EXAME',
                'details'     => 'Exames de sangue, urina e outros laboratoriais. Limite: R$ 3.000,00 | Utilizado: R$ 450,00',
                'limitations' => 'Laboratórios credenciados',
                'co_payment'  => 0.00,
            ],
            [
                'type'        => 'IMAGEM',
                'details'     => 'Raio-X, tomografia, ressonância magnética. Limite: R$ 4.000,00 | Utilizado: R$ 1.200,00',
                'limitations' => 'Com solicitação médica',
                'co_payment'  => 0.00,
            ],
            [
                'type'        => 'INTERNACAO',
                'details'     => 'Internações em hospitais credenciados. Limite: R$ 50.000,00 | Utilizado: R$ 0,00',
                'limitations' => 'Hospitais da rede credenciada',
                'co_payment'  => 0.00,
            ],
            [
                'type'        => 'URGENCIA',
                'details'     => 'Atendimentos de urgência 24h. Limite: R$ 20.000,00 | Utilizado: R$ 0,00',
                'limitations' => 'Pronto-socorros credenciados',
                'co_payment'  => 0.00,
            ],
        ];

        foreach ($coverages as $coverage) {
            $exists = DB::table('coverages')
                ->where('plan_id', $planId)
                ->where('type', $coverage['type'])
                ->exists();

            if (! $exists) {
                DB::table('coverages')->insert(array_merge($coverage, [
                    'id'         => (string) Str::uuid(),
                    'plan_id'    => $planId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]));
            }
        }

        // ── Benefits ───────────────────────────────────────────────────────────
        // benefit columns: id, plan_id, type, description, limitations, usage
        // Note: the DB schema has type (not title/category). We map category → type, title → description prefix.

        $benefits = [
            [
                'type'        => 'digital',
                'description' => 'Telemedicina Ilimitada — Consultas online sem limite de quantidade',
                'limitations' => null,
                'usage'       => null,
            ],
            [
                'type'        => 'specialty',
                'description' => 'Segunda Opinião Médica — Direito a segunda opinião com especialista',
                'limitations' => null,
                'usage'       => null,
            ],
            [
                'type'        => 'coverage',
                'description' => 'Cobertura Nacional — Atendimento em toda rede credenciada do Brasil',
                'limitations' => null,
                'usage'       => null,
            ],
            [
                'type'        => 'digital',
                'description' => 'App Austa Premium — Acesso completo ao aplicativo com IA de saúde',
                'limitations' => null,
                'usage'       => null,
            ],
            [
                'type'        => 'wellness',
                'description' => 'Desconto em Academias — 20% de desconto em academias parceiras',
                'limitations' => 'Academias parceiras da rede Austa',
                'usage'       => null,
            ],
            [
                'type'        => 'wellness',
                'description' => 'Programa de Prevenção — Acesso a programas de saúde preventiva',
                'limitations' => null,
                'usage'       => null,
            ],
        ];

        foreach ($benefits as $benefit) {
            $exists = DB::table('benefits')
                ->where('plan_id', $planId)
                ->where('type', $benefit['type'])
                ->where('description', $benefit['description'])
                ->exists();

            if (! $exists) {
                DB::table('benefits')->insert(array_merge($benefit, [
                    'id'      => (string) Str::uuid(),
                    'plan_id' => $planId,
                ]));
            }
        }

        // ── Claim ──────────────────────────────────────────────────────────────
        // Claims table columns: id, user_id, plan_id, type, amount, status,
        //   submitted_at, approved_at, rejected_at, paid_at, processed_at,
        //   procedure_code, diagnosis_code, service_date, provider_name,
        //   provider_tax_id, procedure_description, receipt_url,
        //   additional_document_urls, status_history, notes, created_at, updated_at

        $claimExists = DB::table('claims')
            ->where('user_id', $userId)
            ->where('plan_id', $planId)
            ->where('service_date', now()->subDays(30)->toDateString())
            ->exists();

        if (! $claimExists) {
            DB::table('claims')->insert([
                'id'                      => (string) Str::uuid(),
                'user_id'                 => $userId,
                'plan_id'                 => $planId,
                'type'                    => 'CONSULTA',
                'amount'                  => 350.00,
                'status'                  => ClaimStatus::APPROVED->value,
                'submitted_at'            => now()->subDays(30),
                'approved_at'             => now()->subDays(25),
                'rejected_at'             => null,
                'paid_at'                 => null,
                'processed_at'            => now()->subDays(25),
                'procedure_code'          => null,
                'diagnosis_code'          => null,
                'service_date'            => now()->subDays(30)->toDateString(),
                'provider_name'           => 'Dr. Roberto Alves',
                'provider_tax_id'         => null,
                'procedure_description'   => 'Consulta cardiologista',
                'receipt_url'             => null,
                'additional_document_urls'=> null,
                'status_history'          => json_encode([
                    ['status' => 'SUBMITTED',   'at' => now()->subDays(30)->toISOString()],
                    ['status' => 'UNDER_REVIEW', 'at' => now()->subDays(28)->toISOString()],
                    ['status' => 'APPROVED',    'at' => now()->subDays(25)->toISOString()],
                ]),
                'notes'      => 'Consulta cardiologista - Dr. Roberto Alves',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
