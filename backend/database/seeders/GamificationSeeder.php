<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GamificationSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // ── Achievements ───────────────────────────────────────────────────────
        DB::table('achievements')->insertOrIgnore([
            ['id' => 'ach-001', 'title' => 'Primeiro Passo',      'description' => 'Registrou sua primeira métrica de saúde',       'journey' => 'health',   'icon' => 'directions_walk', 'xp_reward' => 50],
            ['id' => 'ach-002', 'title' => 'Coração Saudável',    'description' => 'Manteve FC ideal por 7 dias consecutivos',       'journey' => 'health',   'icon' => 'favorite',        'xp_reward' => 100],
            ['id' => 'ach-003', 'title' => 'Mestre dos Passos',   'description' => 'Alcançou 10.000 passos em um dia',               'journey' => 'health',   'icon' => 'directions_run',  'xp_reward' => 75],
            ['id' => 'ach-004', 'title' => 'Fiel ao Tratamento',  'description' => 'Tomou medicamentos por 30 dias seguidos',        'journey' => 'care',     'icon' => 'medication',      'xp_reward' => 150],
            ['id' => 'ach-005', 'title' => 'Consulta em Dia',     'description' => 'Realizou consulta médica preventiva',            'journey' => 'care',     'icon' => 'local_hospital',  'xp_reward' => 100],
            ['id' => 'ach-006', 'title' => 'Sono Reparador',      'description' => 'Dormiu 8h ou mais por 5 dias',                   'journey' => 'health',   'icon' => 'bedtime',         'xp_reward' => 75],
            ['id' => 'ach-007', 'title' => 'Mente Tranquila',     'description' => 'Completou 7 sessões de meditação',               'journey' => 'wellness', 'icon' => 'self_improvement','xp_reward' => 100],
            ['id' => 'ach-008', 'title' => 'Plano Ativo',         'description' => 'Ativou seu plano de saúde',                      'journey' => 'plan',     'icon' => 'card_membership', 'xp_reward' => 50],
            ['id' => 'ach-009', 'title' => 'Bem Hidratado',       'description' => 'Registrou 2L de água por 7 dias',                'journey' => 'wellness', 'icon' => 'water_drop',      'xp_reward' => 75],
            ['id' => 'ach-010', 'title' => 'Explorador',          'description' => 'Usou todas as funcionalidades do app',           'journey' => 'health',   'icon' => 'explore',         'xp_reward' => 200],
        ]);

        // ── Quests ─────────────────────────────────────────────────────────────
        DB::table('quests')->insertOrIgnore([
            ['id' => 'qst-001', 'title' => 'Semana Ativa',           'description' => 'Registre atividade física por 5 dias esta semana', 'journey' => 'health',   'icon' => 'fitness_center',   'xp_reward' => 200],
            ['id' => 'qst-002', 'title' => 'Saúde Cardiovascular',   'description' => 'Monitore sua frequência cardíaca por 7 dias',       'journey' => 'health',   'icon' => 'monitor_heart',    'xp_reward' => 150],
            ['id' => 'qst-003', 'title' => 'Cuidado Preventivo',     'description' => 'Agende e realize uma consulta médica',              'journey' => 'care',     'icon' => 'calendar_today',   'xp_reward' => 250],
            ['id' => 'qst-004', 'title' => 'Equilíbrio Mental',      'description' => 'Complete 5 sessões de meditação em uma semana',     'journey' => 'wellness', 'icon' => 'spa',              'xp_reward' => 175],
            ['id' => 'qst-005', 'title' => 'Plano em Ação',          'description' => 'Utilize um benefício do seu plano de saúde',        'journey' => 'plan',     'icon' => 'health_and_safety','xp_reward' => 125],
        ]);

        // ── Rewards ────────────────────────────────────────────────────────────
        DB::table('rewards')->insertOrIgnore([
            ['id' => 'rwd-001', 'title' => 'Desconto Farmácia',  'description' => '15% de desconto em medicamentos genéricos na Drogasil',  'xp_reward' => 500,  'icon' => 'local_pharmacy', 'journey' => 'care'],
            ['id' => 'rwd-002', 'title' => 'Academia Grátis',    'description' => '1 mês grátis na SmartFit',                               'xp_reward' => 1000, 'icon' => 'fitness_center', 'journey' => 'health'],
            ['id' => 'rwd-003', 'title' => 'Consulta Online',    'description' => '1 consulta online gratuita com clínico geral',            'xp_reward' => 750,  'icon' => 'videocam',       'journey' => 'care'],
            ['id' => 'rwd-004', 'title' => 'Exame Preventivo',   'description' => 'Check-up completo com desconto de 30%',                   'xp_reward' => 800,  'icon' => 'biotech',        'journey' => 'health'],
            ['id' => 'rwd-005', 'title' => 'App Premium',        'description' => '3 meses do plano premium do aplicativo',                  'xp_reward' => 600,  'icon' => 'star',           'journey' => 'wellness'],
        ]);

        // ── Rules (gamification engine) ────────────────────────────────────────
        // Table columns: id (uuid), event, condition, actions (json)
        DB::table('rules')->insertOrIgnore([
            [
                'id'        => (string) Str::uuid(),
                'event'     => 'STEPS_RECORDED',
                'condition' => 'steps >= 10000',
                'actions'   => json_encode([
                    ['type' => 'AWARD_XP',           'xp' => 50],
                    ['type' => 'UNLOCK_ACHIEVEMENT', 'achievement_id' => 'ach-003'],
                ]),
            ],
            [
                'id'        => (string) Str::uuid(),
                'event'     => 'APPOINTMENT_BOOKED',
                'condition' => 'always',
                'actions'   => json_encode([
                    ['type' => 'AWARD_XP',           'xp' => 30],
                    ['type' => 'UNLOCK_ACHIEVEMENT', 'achievement_id' => 'ach-005'],
                ]),
            ],
            [
                'id'        => (string) Str::uuid(),
                'event'     => 'METRIC_RECORDED',
                'condition' => 'first_time',
                'actions'   => json_encode([
                    ['type' => 'AWARD_XP',           'xp' => 10],
                    ['type' => 'UNLOCK_ACHIEVEMENT', 'achievement_id' => 'ach-001'],
                ]),
            ],
        ]);

        // ── UserAchievements for flutter2@test.com ─────────────────────────────
        try {
            $user = DB::table('users')->where('email', 'flutter2@test.com')->first();
            if (! $user) {
                return;
            }

            $profile = DB::table('game_profiles')->where('user_id', $user->id)->first();
            if (! $profile) {
                return;
            }

            $earnedAchievements = ['ach-001', 'ach-003', 'ach-008'];

            foreach ($earnedAchievements as $achievementId) {
                $exists = DB::table('user_achievements')
                    ->where('profile_id', $profile->id)
                    ->where('achievement_id', $achievementId)
                    ->exists();

                if (! $exists) {
                    DB::table('user_achievements')->insert([
                        'profile_id'     => $profile->id,
                        'achievement_id' => $achievementId,
                        'progress'       => 100,
                        'unlocked'       => true,
                        'acknowledged'   => false,
                        'unlocked_at'    => now()->subDays(rand(1, 30)),
                        'created_at'     => $now,
                        'updated_at'     => $now,
                    ]);
                }
            }
        } catch (\Exception $e) {
            $this->command->warn('GamificationSeeder: Could not seed user achievements — ' . $e->getMessage());
        }
    }
}
