<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Personal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

final class PersonalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function view(User $user, Personal $personal): Response
    {
        return $user->isSuperadmin() ? Response::allow() : Response::denyAsNotFound();
    }

    public function create(User $user): bool
    {
        return $user->isSuperadmin();
    }

    public function update(User $user, Personal $personal): Response
    {
        return $user->isSuperadmin() ? Response::allow() : Response::denyAsNotFound();
    }

    public function delete(User $user, Personal $personal): Response
    {
        return $user->isSuperadmin() ? Response::allow() : Response::denyAsNotFound();
    }
}
