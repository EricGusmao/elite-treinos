<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TreinoResource;
use App\Http\Resources\TreinoSummaryResource;
use App\Models\Treino;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class TreinoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $treinos = Treino::query()->get();

        return TreinoSummaryResource::collection($treinos);
    }

    public function show(Treino $treino): JsonResponse
    {
        $treino->load('exercicios');

        return response()->json(new TreinoResource($treino));
    }
}
