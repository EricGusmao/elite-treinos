<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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
            'password' => ['nullable', Password::defaults()],
            'telefone' => ['required', 'string'],
            'cref' => ['nullable', 'string'],
        ];
    }
}
