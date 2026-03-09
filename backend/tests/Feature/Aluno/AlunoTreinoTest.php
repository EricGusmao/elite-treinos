<?php

declare(strict_types=1);

use App\Models\Aluno;
use App\Models\Personal;
use App\Models\Treino;

// ASSIGN WORKOUT
it('personal can assign workout to their student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $response = $this->actingAs($personal->user)->postJson("/api/personal/alunos/{$aluno->id}/treinos", [
        'treino_id' => $treino->id,
    ]);

    $response->assertCreated()
        ->assertJsonPath('codigo', 'A');

    $this->assertDatabaseHas('aluno_treino', [
        'aluno_id' => $aluno->id,
        'treino_id' => $treino->id,
        'personal_id' => $personal->id,
    ]);
});

it('cannot assign more than 2 workouts per student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);

    $treinoA = Treino::query()->where('code', 'A')->first();
    $treinoB = Treino::query()->where('code', 'B')->first();
    $treinoC = Treino::query()->where('code', 'C')->first();

    $aluno->treinos()->attach($treinoA->id, ['personal_id' => $personal->id, 'assigned_at' => now()]);
    $aluno->treinos()->attach($treinoB->id, ['personal_id' => $personal->id, 'assigned_at' => now()]);

    $response = $this->actingAs($personal->user)->postJson("/api/personal/alunos/{$aluno->id}/treinos", [
        'treino_id' => $treinoC->id,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['treino_id']);
});

it('cannot assign duplicate workout to student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $aluno->treinos()->attach($treino->id, ['personal_id' => $personal->id, 'assigned_at' => now()]);

    $response = $this->actingAs($personal->user)->postJson("/api/personal/alunos/{$aluno->id}/treinos", [
        'treino_id' => $treino->id,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['treino_id']);
});

it('cannot assign workout to another personals student', function (): void {
    $personal = Personal::factory()->create();
    $otherAluno = Aluno::factory()->create();
    $treino = Treino::query()->where('code', 'A')->first();

    $this->actingAs($personal->user)->postJson("/api/personal/alunos/{$otherAluno->id}/treinos", [
        'treino_id' => $treino->id,
    ])->assertNotFound();
});

it('returns validation error for invalid treino_id', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);

    $response = $this->actingAs($personal->user)->postJson("/api/personal/alunos/{$aluno->id}/treinos", [
        'treino_id' => 999,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['treino_id']);
});

// REMOVE WORKOUT
it('personal can remove workout from their student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $aluno->treinos()->attach($treino->id, ['personal_id' => $personal->id, 'assigned_at' => now()]);

    $response = $this->actingAs($personal->user)->deleteJson("/api/personal/alunos/{$aluno->id}/treinos/{$treino->id}");

    $response->assertNoContent();

    $this->assertDatabaseMissing('aluno_treino', [
        'aluno_id' => $aluno->id,
        'treino_id' => $treino->id,
    ]);
});

it('cannot remove workout from another personals student', function (): void {
    $personal = Personal::factory()->create();
    $otherAluno = Aluno::factory()->create();
    $treino = Treino::query()->where('code', 'A')->first();

    $otherAluno->treinos()->attach($treino->id, [
        'personal_id' => $otherAluno->personal_id,
        'assigned_at' => now(),
    ]);

    $this->actingAs($personal->user)->deleteJson("/api/personal/alunos/{$otherAluno->id}/treinos/{$treino->id}")
        ->assertNotFound();
});
