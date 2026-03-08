<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;

it('returns the authenticated user profile', function (): void {
    $user = User::factory()->create(['role' => Role::Superadmin]);

    $response = $this->actingAs($user)->getJson('/api/me');

    $response->assertOk()
        ->assertJsonPath('id', $user->id)
        ->assertJsonPath('name', $user->name)
        ->assertJsonPath('email', $user->email)
        ->assertJsonPath('role', 'superadmin');
});

it('returns 401 for unauthenticated request', function (): void {
    $response = $this->getJson('/api/me');

    $response->assertUnauthorized();
});
