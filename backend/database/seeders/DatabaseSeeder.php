<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProviderSeeder::class,
            GamificationSeeder::class,
            PlanSeeder::class,
            HealthDataSeeder::class,
        ]);

        // Meditation sessions catalog
        $now = now();

        DB::table('meditation_sessions')->insertOrIgnore([
            [
                'id'               => '11111111-0000-4000-a000-000000000001',
                'title'            => 'Relaxamento Profundo',
                'category'         => 'Relaxamento',
                'duration_minutes' => 10,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'id'               => '11111111-0000-4000-a000-000000000002',
                'title'            => 'Foco e Concentracao',
                'category'         => 'Foco',
                'duration_minutes' => 15,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'id'               => '11111111-0000-4000-a000-000000000003',
                'title'            => 'Sono Tranquilo',
                'category'         => 'Sono',
                'duration_minutes' => 20,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'id'               => '11111111-0000-4000-a000-000000000004',
                'title'            => 'Alivio da Ansiedade',
                'category'         => 'Ansiedade',
                'duration_minutes' => 12,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'id'               => '11111111-0000-4000-a000-000000000005',
                'title'            => 'Meditacao Matinal',
                'category'         => 'Relaxamento',
                'duration_minutes' => 5,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'id'               => '11111111-0000-4000-a000-000000000006',
                'title'            => 'Corpo e Mente',
                'category'         => 'Foco',
                'duration_minutes' => 8,
                'description'      => null,
                'is_active'        => true,
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
        ]);
    }
}
