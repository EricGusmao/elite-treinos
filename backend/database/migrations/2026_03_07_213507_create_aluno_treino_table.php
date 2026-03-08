<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aluno_treino', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('aluno_id')->constrained('alunos')->cascadeOnDelete();
            $table->foreignId('treino_id')->constrained('treinos')->cascadeOnDelete();
            $table->foreignId('personal_id')->constrained('personais')->cascadeOnDelete();
            $table->timestamp('assigned_at');
            $table->timestamps();

            $table->unique(['aluno_id', 'treino_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aluno_treino');
    }
};
