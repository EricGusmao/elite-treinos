<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdatePersonalRequest extends FormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $personal = $this->route('personal');

        return [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($personal->user_id)],
            'password' => ['nullable', 'string', 'min:6'],
            'telefone' => ['required', 'string'],
            'cref' => ['nullable', 'string'],
        ];
    }
}
