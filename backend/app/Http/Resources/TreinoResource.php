<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Treino */
final class TreinoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->code,
            'nome' => $this->name,
            'objetivo' => $this->objective,
            'exercicios' => ExercicioResource::collection($this->exercicios),
        ];
    }
}
