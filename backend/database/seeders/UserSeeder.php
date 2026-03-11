<?php

namespace Database\Seeders;

use App\Models\GameProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // flutter2@test.com — primary test account used by the Flutter app
        $flutter2Id = (string) Str::uuid();
        DB::table('users')->insertOrIgnore([
            'id'         => $flutter2Id,
            'name'       => 'Ana Paula Silva',
            'email'      => 'flutter2@test.com',
            'password'   => bcrypt('password123'),
            'cpf'        => '123.456.789-00',
            'phone'      => '(11) 98765-4321',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $flutter2User = DB::table('users')->where('email', 'flutter2@test.com')->first();
        if ($flutter2User && ! DB::table('game_profiles')->where('user_id', $flutter2User->id)->exists()) {
            GameProfile::create([
                'user_id' => $flutter2User->id,
                'xp'      => 250,
                'level'   => 3,
            ]);
        }

        // flutter@test.com — secondary test account
        $flutterId = (string) Str::uuid();
        DB::table('users')->insertOrIgnore([
            'id'         => $flutterId,
            'name'       => 'Carlos Eduardo Mendes',
            'email'      => 'flutter@test.com',
            'password'   => bcrypt('password123'),
            'cpf'        => '987.654.321-00',
            'phone'      => '(11) 91234-5678',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $flutterUser = DB::table('users')->where('email', 'flutter@test.com')->first();
        if ($flutterUser && ! DB::table('game_profiles')->where('user_id', $flutterUser->id)->exists()) {
            GameProfile::create([
                'user_id' => $flutterUser->id,
                'xp'      => 0,
                'level'   => 1,
            ]);
        }

        // admin@austa.com.br
        $adminId = (string) Str::uuid();
        DB::table('users')->insertOrIgnore([
            'id'         => $adminId,
            'name'       => 'Administrador Austa',
            'email'      => 'admin@austa.com.br',
            'password'   => bcrypt('password123'),
            'cpf'        => '000.000.000-00',
            'phone'      => '(11) 3000-0000',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $adminUser = DB::table('users')->where('email', 'admin@austa.com.br')->first();
        if ($adminUser && ! DB::table('game_profiles')->where('user_id', $adminUser->id)->exists()) {
            GameProfile::create([
                'user_id' => $adminUser->id,
                'xp'      => 0,
                'level'   => 1,
            ]);
        }
    }
}
