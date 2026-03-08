<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\AlunoResource;
use App\Models\Personal;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

final class PersonalAlunoController extends Controller
{
    public function index(Personal $personal): AnonymousResourceCollection
    {
        Gate::authorize('viewAlunos', $personal);

        $alunos = $personal->alunos()->with(['user', 'treinos'])->get();

        return AlunoResource::collection($alunos);
    }
}
