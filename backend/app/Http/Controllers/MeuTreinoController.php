<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TreinoResource;
use App\Http\Resources\TreinoSummaryResource;
use App\Models\Treino;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class MeuTreinoController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $aluno = $request->user()->aluno;

        abort_unless($aluno !== null, 403);

        $treinos = $aluno->treinos;

        return TreinoSummaryResource::collection($treinos);
    }

    public function show(Request $request, Treino $treino): JsonResponse
    {
        $aluno = $request->user()->aluno;

        abort_unless($aluno !== null, 403);
        abort_unless($aluno->hasTreino($treino->id), 404, 'Treino não encontrado.');

        $treino->load('exercicios');

        return response()->json(new TreinoResource($treino));
    }
}
