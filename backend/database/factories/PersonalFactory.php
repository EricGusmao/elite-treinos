<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Personal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Personal>
 */
final class PersonalFactory extends Factory
{
    protected $model = Personal::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->personal(),
            'phone' => fake()->phoneNumber(),
            'cref' => fake()->optional()->numerify('######-G/SP'),
        ];
    }
}
