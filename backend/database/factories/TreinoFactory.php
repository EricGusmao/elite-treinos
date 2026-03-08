<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Treino;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Treino>
 */
final class TreinoFactory extends Factory
{
    protected $model = Treino::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->randomLetter(),
            'name' => fake()->sentence(3),
            'objective' => fake()->sentence(),
        ];
    }
}
