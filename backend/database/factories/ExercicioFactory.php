<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Exercicio;
use App\Models\Treino;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exercicio>
 */
final class ExercicioFactory extends Factory
{
    protected $model = Exercicio::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'treino_id' => Treino::factory(),
            'order' => fake()->numberBetween(1, 10),
            'name' => fake()->word(),
            'sets' => (string) fake()->numberBetween(1, 5),
            'reps' => (string) fake()->numberBetween(8, 15),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
