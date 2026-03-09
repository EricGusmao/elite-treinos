<?php

declare(strict_types=1);

use App\Models\Aluno;
use App\Models\Personal;
use App\Models\Treino;
use App\Models\User;

// LIST
it('personal can list only their own students', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    Aluno::factory()->create(); // another personal's student

    $response = $this->actingAs($personal->user)->getJson('/api/personal/alunos');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.nome', $aluno->user->name);
});

it('non-personal cannot list alunos', function (): void {
    $user = User::factory()->superadmin()->create();

    $this->actingAs($user)->getJson('/api/personal/alunos')->assertForbidden();
});

it('unauthenticated cannot list alunos', function (): void {
    $this->getJson('/api/personal/alunos')->assertUnauthorized();
});

// CREATE
it('personal can create a student', function (): void {
    $personal = Personal::factory()->create();

    $response = $this->actingAs($personal->user)->postJson('/api/personal/alunos', [
        'nome' => 'Novo Aluno',
        'email' => 'aluno@test.com',
        'password' => 'secret123',
        'data_nascimento' => '2000-01-15',
        'observacoes' => 'Observacao teste',
    ]);

    $response->assertCreated()
        ->assertJsonPath('nome', 'Novo Aluno')
        ->assertJsonPath('email', 'aluno@test.com')
        ->assertJsonPath('dataNascimento', '2000-01-15')
        ->assertJsonPath('observacoes', 'Observacao teste')
        ->assertJsonPath('personalId', $personal->id);

    $this->assertDatabaseHas('users', [
        'email' => 'aluno@test.com',
        'role' => 'aluno',
    ]);
});

it('returns validation errors for missing fields on aluno create', function (): void {
    $personal = Personal::factory()->create();

    $response = $this->actingAs($personal->user)->postJson('/api/personal/alunos', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['nome', 'email', 'password']);
});

it('returns validation error for duplicate email on aluno create', function (): void {
    $personal = Personal::factory()->create();
    User::factory()->create(['email' => 'taken@test.com']);

    $response = $this->actingAs($personal->user)->postJson('/api/personal/alunos', [
        'nome' => 'Test',
        'email' => 'taken@test.com',
        'password' => 'secret123',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('non-personal cannot create aluno', function (): void {
    $user = User::factory()->superadmin()->create();

    $this->actingAs($user)->postJson('/api/personal/alunos', [
        'nome' => 'Test',
        'email' => 'test@test.com',
        'password' => 'secret123',
    ])->assertForbidden();
});

// SHOW
it('personal can view their own student with embedded treinos', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $treino = Treino::query()->where('code', 'A')->first();

    $aluno->treinos()->attach($treino->id, [
        'personal_id' => $personal->id,
        'assigned_at' => now(),
    ]);

    $response = $this->actingAs($personal->user)->getJson("/api/personal/alunos/{$aluno->id}");

    $response->assertOk()
        ->assertJsonPath('nome', $aluno->user->name)
        ->assertJsonPath('treinos.0.codigo', 'A')
        ->assertJsonPath('treinos.0.nome', $treino->name);
});

it('personal cannot view another personals student', function (): void {
    $personal = Personal::factory()->create();
    $otherAluno = Aluno::factory()->create(); // belongs to a different personal

    $this->actingAs($personal->user)->getJson("/api/personal/alunos/{$otherAluno->id}")
        ->assertForbidden();
});

// UPDATE
it('personal can update their own student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);

    $response = $this->actingAs($personal->user)->putJson("/api/personal/alunos/{$aluno->id}", [
        'nome' => 'Updated Name',
        'email' => $aluno->user->email,
        'observacoes' => 'Updated notes',
    ]);

    $response->assertOk()
        ->assertJsonPath('nome', 'Updated Name')
        ->assertJsonPath('observacoes', 'Updated notes');
});

it('personal cannot update another personals student', function (): void {
    $personal = Personal::factory()->create();
    $otherAluno = Aluno::factory()->create();

    $this->actingAs($personal->user)->putJson("/api/personal/alunos/{$otherAluno->id}", [
        'nome' => 'Updated',
        'email' => $otherAluno->user->email,
    ])->assertForbidden();
});

// DELETE
it('personal can delete their own student', function (): void {
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);
    $userId = $aluno->user_id;

    $this->actingAs($personal->user)->deleteJson("/api/personal/alunos/{$aluno->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('alunos', ['id' => $aluno->id]);
    $this->assertDatabaseMissing('users', ['id' => $userId]);
});

it('personal cannot delete another personals student', function (): void {
    $personal = Personal::factory()->create();
    $otherAluno = Aluno::factory()->create();

    $this->actingAs($personal->user)->deleteJson("/api/personal/alunos/{$otherAluno->id}")
        ->assertForbidden();
});
