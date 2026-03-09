<?php

declare(strict_types=1);

use App\Http\Controllers\AlunoController;
use App\Http\Controllers\AlunoTreinoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\MeuTreinoController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\TreinoController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    // Superadmin
    Route::prefix('admin')->group(function (): void {
        Route::apiResource('personais', PersonalController::class)
            ->parameters(['personais' => 'personal']);
    });

    // Personal
    Route::prefix('personal')->group(function (): void {
        Route::apiResource('alunos', AlunoController::class);
        Route::post('/alunos/{aluno}/treinos', [AlunoTreinoController::class, 'store']);
        Route::delete('/alunos/{aluno}/treinos/{treino}', [AlunoTreinoController::class, 'destroy']);
        Route::get('/treinos', [TreinoController::class, 'index']);
        Route::get('/treinos/{treino}', [TreinoController::class, 'show']);
    });

    // Aluno
    Route::prefix('aluno')->group(function (): void {
        Route::get('/meus-treinos', [MeuTreinoController::class, 'index']);
        Route::get('/meus-treinos/{treino}', [MeuTreinoController::class, 'show']);
    });

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::post('/login', [AuthController::class, 'login']);
