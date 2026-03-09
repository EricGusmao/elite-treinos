<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->withHeader('Origin', config('sanctum.stateful')[0]);
});

it('logs out and invalidates session', function (): void {
    User::factory()->create([
        'email' => 'test@test.com',
        'password' => bcrypt('secret123'),
    ]);

    $this->postJson('/api/login', [
        'email' => 'test@test.com',
        'password' => 'secret123',
    ])->assertOk();

    $this->postJson('/api/logout')->assertNoContent();

    $this->app['auth']->forgetGuards();

    $this->getJson('/api/me')->assertUnauthorized();
});

it('returns 401 for unauthenticated request', function (): void {
    $response = $this->postJson('/api/logout');

    $response->assertUnauthorized();
});
