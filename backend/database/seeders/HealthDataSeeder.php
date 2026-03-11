<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HealthDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = DB::table('users')->where('email', 'flutter2@test.com')->first();

        if (! $user) {
            $this->command->warn('HealthDataSeeder: flutter2@test.com not found — run UserSeeder first.');
            return;
        }

        $userId = $user->id;
        $now    = now();

        // ── Health Metrics ─────────────────────────────────────────────────────

        // WEIGHT: 14 days, 68.5 → 70.2 kg
        for ($i = 13; $i >= 0; $i--) {
            $value = round(68.5 + ((13 - $i) * (1.7 / 13)), 1);
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'WEIGHT',
                'value'      => $value,
                'unit'       => 'kg',
                'timestamp'  => now()->subDays($i)->setTime(8, 0, 0),
                'source'     => 'USER_INPUT',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> false,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // HEART_RATE: 14 days, 65–78 bpm
        $heartRates = [72, 68, 75, 70, 65, 78, 71, 73, 67, 76, 69, 74, 66, 77];
        for ($i = 13; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'HEART_RATE',
                'value'      => $heartRates[13 - $i],
                'unit'       => 'bpm',
                'timestamp'  => now()->subDays($i)->setTime(9, 0, 0),
                'source'     => 'DEVICE',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> false,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // BLOOD_PRESSURE_SYSTOLIC: 14 days, 118–132 mmHg
        $systolicValues = [120, 118, 125, 122, 119, 132, 121, 128, 118, 130, 124, 119, 127, 122];
        for ($i = 13; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'BLOOD_PRESSURE_SYSTOLIC',
                'value'      => $systolicValues[13 - $i],
                'unit'       => 'mmHg',
                'timestamp'  => now()->subDays($i)->setTime(7, 30, 0),
                'source'     => 'DEVICE',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> $systolicValues[13 - $i] > 130,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // BLOOD_PRESSURE_DIASTOLIC: 14 days, 75–85 mmHg
        $diastolicValues = [78, 75, 82, 79, 76, 85, 80, 83, 77, 84, 79, 76, 81, 78];
        for ($i = 13; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'BLOOD_PRESSURE_DIASTOLIC',
                'value'      => $diastolicValues[13 - $i],
                'unit'       => 'mmHg',
                'timestamp'  => now()->subDays($i)->setTime(7, 30, 0),
                'source'     => 'DEVICE',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> false,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // SLEEP: 7 days, 6.0–8.5 hours
        $sleepValues = [7.5, 6.0, 8.5, 7.0, 6.5, 8.0, 7.5];
        for ($i = 6; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'SLEEP',
                'value'      => $sleepValues[6 - $i],
                'unit'       => 'h',
                'timestamp'  => now()->subDays($i)->setTime(6, 0, 0),
                'source'     => 'DEVICE',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> $sleepValues[6 - $i] < 6.5,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // STEPS: 7 days, 4500–12000
        $stepsValues = [8500, 4500, 12000, 7800, 6200, 10500, 9300];
        for ($i = 6; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'STEPS',
                'value'      => $stepsValues[6 - $i],
                'unit'       => 'steps',
                'timestamp'  => now()->subDays($i)->setTime(23, 59, 0),
                'source'     => 'DEVICE',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> false,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // BLOOD_GLUCOSE: 7 days, 85–110 mg/dL
        $glucoseValues = [95, 88, 102, 85, 110, 92, 98];
        for ($i = 6; $i >= 0; $i--) {
            DB::table('health_metrics')->insert([
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'type'       => 'BLOOD_GLUCOSE',
                'value'      => $glucoseValues[6 - $i],
                'unit'       => 'mg/dL',
                'timestamp'  => now()->subDays($i)->setTime(7, 0, 0),
                'source'     => 'USER_INPUT',
                'notes'      => null,
                'trend'      => null,
                'is_abnormal'=> $glucoseValues[6 - $i] > 100,
                'metadata'   => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── Medications ────────────────────────────────────────────────────────

        $medications = [
            [
                'name'             => 'Losartana',
                'dosage'           => 50,
                'frequency'        => '1x ao dia',
                'start_date'       => now()->subMonths(3)->toDateString(),
                'end_date'         => null,
                'active'           => true,
                'reminder_enabled' => true,
                'notes'            => 'Para controle da pressão arterial',
            ],
            [
                'name'             => 'Vitamina D',
                'dosage'           => 2000,
                'frequency'        => '1x ao dia',
                'start_date'       => now()->subMonths(6)->toDateString(),
                'end_date'         => null,
                'active'           => true,
                'reminder_enabled' => true,
                'notes'            => 'Suplementação de Vitamina D3',
            ],
            [
                'name'             => 'Omeprazol',
                'dosage'           => 20,
                'frequency'        => '1x ao dia em jejum',
                'start_date'       => now()->subMonth()->toDateString(),
                'end_date'         => now()->addMonths(2)->toDateString(),
                'active'           => true,
                'reminder_enabled' => false,
                'notes'            => 'Para proteção gástrica',
            ],
            [
                'name'             => 'Amoxicilina',
                'dosage'           => 500,
                'frequency'        => '3x ao dia',
                'start_date'       => now()->subDays(10)->toDateString(),
                'end_date'         => now()->subDays(5)->toDateString(),
                'active'           => false,
                'reminder_enabled' => false,
                'notes'            => 'Antibiótico — curso completo',
            ],
        ];

        foreach ($medications as $med) {
            DB::table('medications')->insert(array_merge($med, [
                'id'         => (string) Str::uuid(),
                'user_id'    => $userId,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // ── Appointments ───────────────────────────────────────────────────────

        try {
            $cardiologia  = DB::table('providers')->where('specialty', 'Cardiologia')->first();
            $clinicaGeral = DB::table('providers')->where('specialty', 'Clínica Geral')->first();
            $psiquiatria  = DB::table('providers')->where('specialty', 'Psiquiatria')->first();

            if ($cardiologia) {
                // 1. Cardiologia — IN_PERSON — 3 days from now — scheduled
                DB::table('appointments')->insert([
                    'id'               => (string) Str::uuid(),
                    'user_id'          => $userId,
                    'provider_id'      => $cardiologia->id,
                    'date_time'        => now()->addDays(3)->setTime(10, 0, 0),
                    'duration_minutes' => 30,
                    'type'             => 'IN_PERSON',
                    'status'           => AppointmentStatus::SCHEDULED->value,
                    'notes'            => 'Consulta de rotina',
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ]);

                // 3. Cardiologia — IN_PERSON — 30 days ago — completed
                DB::table('appointments')->insert([
                    'id'               => (string) Str::uuid(),
                    'user_id'          => $userId,
                    'provider_id'      => $cardiologia->id,
                    'date_time'        => now()->subDays(30)->setTime(14, 0, 0),
                    'duration_minutes' => 45,
                    'type'             => 'IN_PERSON',
                    'status'           => AppointmentStatus::COMPLETED->value,
                    'notes'            => 'Check-up anual',
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ]);
            }

            if ($clinicaGeral) {
                // 2. Clínica Geral — TELEMEDICINE — 7 days from now — scheduled
                DB::table('appointments')->insert([
                    'id'               => (string) Str::uuid(),
                    'user_id'          => $userId,
                    'provider_id'      => $clinicaGeral->id,
                    'date_time'        => now()->addDays(7)->setTime(15, 0, 0),
                    'duration_minutes' => 20,
                    'type'             => 'TELEMEDICINE',
                    'status'           => AppointmentStatus::SCHEDULED->value,
                    'notes'            => 'Renovação de receita',
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ]);
            }

            if ($psiquiatria) {
                // 4. Psiquiatria — TELEMEDICINE — 45 days ago — completed
                DB::table('appointments')->insert([
                    'id'               => (string) Str::uuid(),
                    'user_id'          => $userId,
                    'provider_id'      => $psiquiatria->id,
                    'date_time'        => now()->subDays(45)->setTime(11, 0, 0),
                    'duration_minutes' => 50,
                    'type'             => 'TELEMEDICINE',
                    'status'           => AppointmentStatus::COMPLETED->value,
                    'notes'            => 'Acompanhamento mensal',
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ]);
            }
        } catch (\Exception $e) {
            $this->command->warn('HealthDataSeeder: Could not seed appointments — ' . $e->getMessage());
        }

        // ── Medical Events ─────────────────────────────────────────────────────

        DB::table('medical_events')->insert([
            [
                'id'          => (string) Str::uuid(),
                'user_id'     => $userId,
                'type'        => 'EXAM',
                'title'       => 'Hemograma Completo',
                'description' => 'Resultado dentro dos parâmetros normais',
                'provider'    => 'Laboratório Fleury',
                'location'    => 'São Paulo, SP',
                'date'        => now()->subDays(15)->toDateString(),
                'documents'   => null,
                'tags'        => json_encode(['exame', 'sangue', 'rotina']),
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'id'          => (string) Str::uuid(),
                'user_id'     => $userId,
                'type'        => 'VACCINATION',
                'title'       => 'Vacina Influenza',
                'description' => 'Vacinação anual contra gripe',
                'provider'    => 'UBS Vila Mariana',
                'location'    => 'São Paulo, SP',
                'date'        => now()->subDays(90)->toDateString(),
                'documents'   => null,
                'tags'        => json_encode(['vacina', 'gripe', 'prevenção']),
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }
}
