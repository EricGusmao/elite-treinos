<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Aluno;
use App\Models\Personal;
use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@elite.com',
            'role' => Role::Superadmin,
        ]);

        // Personal trainers with students
        $carlos = Personal::factory()->create([
            'user_id' => User::factory()->personal()->create([
                'name' => 'Carlos Silva',
                'email' => 'carlos@elite.com',
            ])->id,
            'phone' => '(11) 99999-0001',
            'cref' => '012345-G/SP',
        ]);

        $ana = Personal::factory()->create([
            'user_id' => User::factory()->personal()->create([
                'name' => 'Ana Oliveira',
                'email' => 'ana@elite.com',
            ])->id,
            'phone' => '(11) 99999-0002',
            'cref' => '067890-G/SP',
        ]);

        // Students
        Aluno::factory()->create([
            'user_id' => User::factory()->aluno()->create([
                'name' => 'Joao Pereira',
                'email' => 'joao@email.com',
            ])->id,
            'personal_id' => $carlos->id,
            'birth_date' => '1995-03-15',
        ]);

        Aluno::factory()->create([
            'user_id' => User::factory()->aluno()->create([
                'name' => 'Maria Costa',
                'email' => 'maria@email.com',
            ])->id,
            'personal_id' => $carlos->id,
            'birth_date' => '1998-07-22',
            'notes' => 'Problema no joelho esquerdo',
        ]);

        Aluno::factory()->create([
            'user_id' => User::factory()->aluno()->create([
                'name' => 'Pedro Lima',
                'email' => 'pedro@email.com',
            ])->id,
            'personal_id' => $ana->id,
            'birth_date' => '2000-01-10',
        ]);
    }
}
