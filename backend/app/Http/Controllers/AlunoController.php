<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlunoRequest;
use App\Http\Requests\UpdateAlunoRequest;
use App\Http\Resources\AlunoResource;
use App\Models\Aluno;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class AlunoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Aluno::class);

        $personal = $request->user()->personal;
        $alunos = $personal->alunos()->with(['user', 'treinos'])->get();

        return AlunoResource::collection($alunos);
    }

    public function store(StoreAlunoRequest $request): JsonResponse
    {
        Gate::authorize('create', Aluno::class);

        $personal = $request->user()->personal;
        $aluno = Aluno::createForPersonal($personal, $request->validated());

        return response()->json(new AlunoResource($aluno), 201);
    }

    public function show(Aluno $aluno): JsonResponse
    {
        Gate::authorize('view', $aluno);

        $aluno->load(['user', 'treinos']);

        return response()->json(new AlunoResource($aluno));
    }

    public function update(UpdateAlunoRequest $request, Aluno $aluno): JsonResponse
    {
        Gate::authorize('update', $aluno);

        $aluno->updateWithUser($request->validated());

        return response()->json(new AlunoResource($aluno));
    }

    public function destroy(Aluno $aluno): Response
    {
        Gate::authorize('delete', $aluno);

        $aluno->deleteWithUser();

        return response()->noContent();
    }
}
