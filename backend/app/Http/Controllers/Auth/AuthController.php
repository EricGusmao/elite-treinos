<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

final class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::authenticate(
            $request->validated('email'),
            $request->validated('password'),
        );

        if (!$user instanceof User) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $request->session()->regenerate();

        return response()->json(new UserResource($user));
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()));
    }
}
