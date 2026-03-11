<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $providers = [
            [
                'name'                  => 'Dra. Mariana Costa',
                'specialty'             => 'Cardiologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3456-7890',
                'email'                 => 'mariana.costa@hospital.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dr. Roberto Alves',
                'specialty'             => 'Clínica Geral',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3234-5678',
                'email'                 => 'roberto.alves@clinica.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dra. Fernanda Lima',
                'specialty'             => 'Dermatologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3345-6789',
                'email'                 => 'fernanda.lima@derm.com',
                'telemedicine_available' => false,
            ],
            [
                'name'                  => 'Dr. Paulo Santos',
                'specialty'             => 'Ortopedia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3567-8901',
                'email'                 => 'paulo.santos@ortho.com',
                'telemedicine_available' => false,
            ],
            [
                'name'                  => 'Dra. Julia Rodrigues',
                'specialty'             => 'Psiquiatria',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3678-9012',
                'email'                 => 'julia.rodrigues@psiq.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dr. Marcos Oliveira',
                'specialty'             => 'Neurologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3789-0123',
                'email'                 => 'marcos.oliveira@neuro.com',
                'telemedicine_available' => false,
            ],
            [
                'name'                  => 'Dra. Beatriz Ferreira',
                'specialty'             => 'Ginecologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3890-1234',
                'email'                 => 'beatriz.ferreira@gineco.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dr. André Souza',
                'specialty'             => 'Endocrinologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3901-2345',
                'email'                 => 'andre.souza@endo.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dra. Camila Torres',
                'specialty'             => 'Oftalmologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3012-3456',
                'email'                 => 'camila.torres@oftalmo.com',
                'telemedicine_available' => false,
            ],
            [
                'name'                  => 'Dr. Lucas Mendes',
                'specialty'             => 'Gastroenterologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3123-4567',
                'email'                 => 'lucas.mendes@gastro.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dra. Priscila Nunes',
                'specialty'             => 'Pediatria',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3234-6789',
                'email'                 => 'priscila.nunes@pediatria.com',
                'telemedicine_available' => true,
            ],
            [
                'name'                  => 'Dr. Felipe Castro',
                'specialty'             => 'Urologia',
                'location'              => 'São Paulo, SP',
                'phone'                 => '(11) 3456-8901',
                'email'                 => 'felipe.castro@uro.com',
                'telemedicine_available' => false,
            ],
        ];

        foreach ($providers as $provider) {
            // Only insert if the email doesn't exist yet
            if (! DB::table('providers')->where('email', $provider['email'])->exists()) {
                DB::table('providers')->insert(array_merge($provider, [
                    'id'         => (string) Str::uuid(),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]));
            }
        }
    }
}
