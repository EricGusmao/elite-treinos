<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StorePersonalRequest;
use App\Http\Requests\UpdatePersonalRequest;
use App\Http\Resources\PersonalResource;
use App\Models\Personal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

final class PersonalController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Personal::class);

        $personais = Personal::query()->with('user')->get();

        return PersonalResource::collection($personais);
    }

    public function store(StorePersonalRequest $request): JsonResponse
    {
        Gate::authorize('create', Personal::class);

        $personal = Personal::createWithUser($request->validated());

        return response()->json(new PersonalResource($personal), 201);
    }

    public function show(Personal $personal): JsonResponse
    {
        Gate::authorize('view', $personal);

        $personal->load('user');

        return response()->json(new PersonalResource($personal));
    }

    public function update(UpdatePersonalRequest $request, Personal $personal): JsonResponse
    {
        Gate::authorize('update', $personal);

        $personal->updateWithUser($request->validated());

        return response()->json(new PersonalResource($personal));
    }

    public function destroy(Personal $personal): Response
    {
        Gate::authorize('delete', $personal);

        $personal->deleteWithUser();

        return response()->noContent();
    }
}
