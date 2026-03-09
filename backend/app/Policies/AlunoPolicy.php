<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Aluno;
use App\Models\User;
use Illuminate\Auth\Access\Response;

final class AlunoPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isPersonal();
    }

    public function view(User $user, Aluno $aluno): Response
    {
        return $this->ownsAluno($user, $aluno);
    }

    public function create(User $user): bool
    {
        return $user->isPersonal();
    }

    public function update(User $user, Aluno $aluno): Response
    {
        return $this->ownsAluno($user, $aluno);
    }

    public function delete(User $user, Aluno $aluno): Response
    {
        return $this->ownsAluno($user, $aluno);
    }

    public function manageTreinos(User $user, Aluno $aluno): Response
    {
        return $this->ownsAluno($user, $aluno);
    }

    private function ownsAluno(User $user, Aluno $aluno): Response
    {
        return $user->isPersonal() && $user->personal?->id === $aluno->personal_id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
