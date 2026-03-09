<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Aluno */
final class AlunoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->user->name,
            'email' => $this->user->email,
            'dataNascimento' => $this->birth_date?->toDateString(),
            'observacoes' => $this->notes,
            'personalId' => $this->personal_id,
            'treinos' => TreinoResource::collection($this->whenLoaded('treinos')),
        ];
    }
}
