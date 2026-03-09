<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Personal;
use App\Models\User;

final class PersonalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function view(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function create(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function update(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function delete(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function viewAlunos(User $user): bool
    {
        return $user->isSuperadmin();
    }
}
