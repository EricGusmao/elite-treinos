<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Personal */
final class PersonalDetailResource extends JsonResource
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
            'telefone' => $this->phone,
            'cref' => $this->cref,
            'alunos' => AlunoSummaryResource::collection($this->alunos),
        ];
    }
}
