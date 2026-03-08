<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TreinoResource;
use App\Models\Treino;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class TreinoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $treinos = Treino::query()->with('exercicios')->get();

        return TreinoResource::collection($treinos);
    }
}
