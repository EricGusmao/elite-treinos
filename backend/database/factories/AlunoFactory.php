<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Aluno;
use App\Models\Personal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Aluno>
 */
final class AlunoFactory extends Factory
{
    protected $model = Aluno::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->aluno(),
            'personal_id' => Personal::factory(),
            'birth_date' => fake()->optional()->date(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
