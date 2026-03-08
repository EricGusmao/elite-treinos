<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

final class UpdateAlunoRequest extends FormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $aluno = $this->route('aluno');

        return [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($aluno->user_id)],
            'password' => ['nullable', Password::defaults()],
            'data_nascimento' => ['nullable', 'date'],
            'observacoes' => ['nullable', 'string'],
        ];
    }
}
