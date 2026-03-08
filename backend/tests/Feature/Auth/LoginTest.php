<?php

declare(strict_types=1);

use App\Enums\Role;
use App\Models\User;

it('returns user on valid credentials', function (): void {
    $user = User::factory()->create([
        'password' => bcrypt('secret123'),
        'role' => Role::Personal,
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['id', 'name', 'email', 'role'])
        ->assertJsonPath('id', $user->id)
        ->assertJsonPath('role', 'personal');

    $this->assertAuthenticatedAs($user);
});

it('returns 401 for invalid credentials', function (): void {
    User::factory()->create([
        'email' => 'user@test.com',
        'password' => bcrypt('secret123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'user@test.com',
        'password' => 'wrong',
    ]);

    $response->assertUnauthorized();
    $this->assertGuest();
});

it('returns 422 for missing fields', function (): void {
    $response = $this->postJson('/api/login', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});
