<?php

declare(strict_types=1);

use App\Models\User;

it('returns all treinos with exercicios for authenticated user', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/treinos');

    // 4 production treinos seeded via migration
    $response->assertOk()
        ->assertJsonCount(4, 'data')
        ->assertJsonPath('data.0.codigo', 'A')
        ->assertJsonPath('data.0.nome', 'Treino A — Full Body (Base)')
        ->assertJsonPath('data.0.exercicios.0.nome', 'Agachamento livre')
        ->assertJsonPath('data.0.exercicios.0.series', '3')
        ->assertJsonPath('data.0.exercicios.0.repeticoes', '10');
});

it('returns 401 for unauthenticated request', function (): void {
    $this->getJson('/api/treinos')->assertUnauthorized();
});
