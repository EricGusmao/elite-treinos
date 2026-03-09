<?php

declare(strict_types=1);

use App\Models\Personal;
use App\Models\Treino;
use App\Models\User;

// LIST
it('returns all treinos as summaries without exercicios', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/treinos');

    $response->assertOk()
        ->assertJsonCount(4, 'data')
        ->assertJsonPath('data.0.codigo', 'A')
        ->assertJsonPath('data.0.nome', 'Treino A — Full Body (Base)')
        ->assertJsonMissingPath('data.0.exercicios');
});

it('returns 401 for unauthenticated request to list treinos', function (): void {
    $this->getJson('/api/treinos')->assertUnauthorized();
});

// SHOW
it('personal can view treino detail with exercises', function (): void {
    $personal = Personal::factory()->create();
    $treino = Treino::query()->where('code', 'A')->first();

    $response = $this->actingAs($personal->user)->getJson("/api/personal/treinos/{$treino->id}");

    $response->assertOk()
        ->assertJsonPath('codigo', 'A')
        ->assertJsonPath('nome', $treino->name)
        ->assertJsonPath('objetivo', $treino->objective)
        ->assertJsonPath('exercicios.0.nome', 'Agachamento livre');
});

it('returns 404 for non-existent treino', function (): void {
    $personal = Personal::factory()->create();

    $this->actingAs($personal->user)->getJson('/api/personal/treinos/999')
        ->assertNotFound();
});

it('returns 401 for unauthenticated request to show treino', function (): void {
    $treino = Treino::query()->where('code', 'A')->first();

    $this->getJson("/api/personal/treinos/{$treino->id}")->assertUnauthorized();
});
