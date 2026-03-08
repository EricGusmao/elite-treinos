<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Exercicio */
final class ExercicioResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'ordem' => $this->order,
            'nome' => $this->name,
            'series' => $this->sets,
            'repeticoes' => $this->reps,
            'observacoes' => $this->when($this->notes !== null, $this->notes),
        ];
    }
}
