<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\Aluno;
use App\Models\Personal;
use App\Models\User;

// LIST
it('superadmin can list personais', function (): void {
    $admin = User::factory()->superadmin()->create();
    $personal = Personal::factory()->create();

    $response = $this->actingAs($admin)->getJson('/api/personais');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.nome', $personal->user->name);
});

it('non-superadmin cannot list personais', function (): void {
    $user = User::factory()->create(['role' => Role::Personal]);

    $this->actingAs($user)->getJson('/api/personais')->assertForbidden();
});

it('unauthenticated cannot list personais', function (): void {
    $this->getJson('/api/personais')->assertUnauthorized();
});

// CREATE
it('superadmin can create a personal', function (): void {
    $admin = User::factory()->superadmin()->create();

    $response = $this->actingAs($admin)->postJson('/api/personais', [
        'nome' => 'Novo Personal',
        'email' => 'novo@elite.com',
        'password' => 'secret123',
        'telefone' => '(11) 99999-9999',
        'cref' => '123456-G/SP',
    ]);

    $response->assertCreated()
        ->assertJsonPath('nome', 'Novo Personal')
        ->assertJsonPath('email', 'novo@elite.com')
        ->assertJsonPath('telefone', '(11) 99999-9999')
        ->assertJsonPath('cref', '123456-G/SP');

    $this->assertDatabaseHas('users', [
        'email' => 'novo@elite.com',
        'role' => 'personal',
    ]);
});

it('returns validation errors for missing fields on create', function (): void {
    $admin = User::factory()->superadmin()->create();

    $response = $this->actingAs($admin)->postJson('/api/personais', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['nome', 'email', 'password', 'telefone']);
});

it('returns validation error for duplicate email on create', function (): void {
    $admin = User::factory()->superadmin()->create();
    User::factory()->create(['email' => 'taken@elite.com']);

    $response = $this->actingAs($admin)->postJson('/api/personais', [
        'nome' => 'Test',
        'email' => 'taken@elite.com',
        'password' => 'secret123',
        'telefone' => '(11) 99999-0000',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('non-superadmin cannot create personal', function (): void {
    $user = User::factory()->create(['role' => Role::Aluno]);

    $this->actingAs($user)->postJson('/api/personais', [
        'nome' => 'Test',
        'email' => 'test@elite.com',
        'password' => 'secret123',
        'telefone' => '(11) 99999-0000',
    ])->assertForbidden();
});

// SHOW
it('superadmin can view a personal', function (): void {
    $admin = User::factory()->superadmin()->create();
    $personal = Personal::factory()->create();

    $response = $this->actingAs($admin)->getJson("/api/personais/{$personal->id}");

    $response->assertOk()
        ->assertJsonPath('nome', $personal->user->name)
        ->assertJsonPath('email', $personal->user->email);
});

it('returns 404 for non-existent personal', function (): void {
    $admin = User::factory()->superadmin()->create();

    $this->actingAs($admin)->getJson('/api/personais/999')->assertNotFound();
});

// UPDATE
it('superadmin can update a personal', function (): void {
    $admin = User::factory()->superadmin()->create();
    $personal = Personal::factory()->create();

    $response = $this->actingAs($admin)->putJson("/api/personais/{$personal->id}", [
        'nome' => 'Updated Name',
        'email' => $personal->user->email,
        'telefone' => '(11) 88888-8888',
    ]);

    $response->assertOk()
        ->assertJsonPath('nome', 'Updated Name')
        ->assertJsonPath('telefone', '(11) 88888-8888');
});

it('returns validation error for duplicate email on update', function (): void {
    $admin = User::factory()->superadmin()->create();
    User::factory()->create(['email' => 'other@elite.com']);
    $personal = Personal::factory()->create();

    $response = $this->actingAs($admin)->putJson("/api/personais/{$personal->id}", [
        'nome' => 'Test',
        'email' => 'other@elite.com',
        'telefone' => '(11) 99999-0000',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

// DELETE
it('superadmin can delete a personal', function (): void {
    $admin = User::factory()->superadmin()->create();
    $personal = Personal::factory()->create();
    $userId = $personal->user_id;

    $this->actingAs($admin)->deleteJson("/api/personais/{$personal->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('personais', ['id' => $personal->id]);
    $this->assertDatabaseMissing('users', ['id' => $userId]);
});

it('non-superadmin cannot delete personal', function (): void {
    $user = User::factory()->create(['role' => Role::Aluno]);
    $personal = Personal::factory()->create();

    $this->actingAs($user)->deleteJson("/api/personais/{$personal->id}")
        ->assertForbidden();
});

// LIST PERSONAL'S ALUNOS
it('superadmin can list students of a personal', function (): void {
    $admin = User::factory()->superadmin()->create();
    $personal = Personal::factory()->create();
    $aluno = Aluno::factory()->create(['personal_id' => $personal->id]);

    $response = $this->actingAs($admin)->getJson("/api/personais/{$personal->id}/alunos");

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.nome', $aluno->user->name);
});

it('non-superadmin cannot list personal alunos', function (): void {
    $user = User::factory()->create(['role' => Role::Aluno]);
    $personal = Personal::factory()->create();

    $this->actingAs($user)->getJson("/api/personais/{$personal->id}/alunos")
        ->assertForbidden();
});
