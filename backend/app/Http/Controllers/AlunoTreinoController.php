<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AssignTreinoRequest;
use App\Http\Resources\TreinoResource;
use App\Models\Aluno;
use App\Models\Treino;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class AlunoTreinoController extends Controller
{
    public function index(Aluno $aluno): AnonymousResourceCollection
    {
        Gate::authorize('manageTreinos', $aluno);

        $treinos = $aluno->treinos()->with('exercicios')->get();

        return TreinoResource::collection($treinos);
    }

    public function store(AssignTreinoRequest $request, Aluno $aluno): JsonResponse
    {
        Gate::authorize('manageTreinos', $aluno);

        $personal = $request->user()->personal;
        $treino = $aluno->assignTreino($request->validated('treino_id'), $personal);

        return response()->json(new TreinoResource($treino), 201);
    }

    public function destroy(Aluno $aluno, Treino $treino): Response
    {
        Gate::authorize('manageTreinos', $aluno);

        $aluno->removeTreino($treino->id);

        return response()->noContent();
    }
}
