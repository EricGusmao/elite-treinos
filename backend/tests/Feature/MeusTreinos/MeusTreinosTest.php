<?php

declare(strict_types=1);

use App\Models\Aluno;
use App\Models\Personal;
use App\Models\Treino;
use App\Models\User;

// LIST
it('student can list their assigned workouts', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $aluno->treinos()->attach($treino->id, [
        'personal_id' => $personal->id,
        'assigned_at' => now(),
    ]);

    $response = $this->actingAs($aluno->user)->getJson('/api/meus-treinos');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.codigo', 'A')
        ->assertJsonPath('data.0.nome', $treino->name);
});

it('non-student cannot access meus-treinos', function (): void {
    $user = User::factory()->superadmin()->create();

    $this->actingAs($user)->getJson('/api/meus-treinos')->assertForbidden();
});

it('unauthenticated cannot access meus-treinos', function (): void {
    $this->getJson('/api/meus-treinos')->assertUnauthorized();
});

// SHOW
it('student can view workout detail with exercises', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $aluno->treinos()->attach($treino->id, [
        'personal_id' => $personal->id,
        'assigned_at' => now(),
    ]);

    $response = $this->actingAs($aluno->user)->getJson("/api/meus-treinos/{$treino->id}");

    $response->assertOk()
        ->assertJsonPath('codigo', 'A')
        ->assertJsonPath('exercicios.0.nome', 'Agachamento livre');
});

it('student cannot view unassigned workout', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $this->actingAs($aluno->user)->getJson("/api/meus-treinos/{$treino->id}")
        ->assertNotFound();
});
