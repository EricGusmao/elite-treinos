<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercicios', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('treino_id')->constrained('treinos')->cascadeOnDelete();
            $table->unsignedInteger('order');
            $table->string('name');
            $table->string('sets');
            $table->string('reps');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        $now = now();

        DB::table('exercicios')->insert([
            // Treino A — Full Body
            ['treino_id' => 1, 'order' => 1, 'name' => 'Agachamento livre', 'sets' => '3', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 1, 'order' => 2, 'name' => 'Supino reto', 'sets' => '3', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 1, 'order' => 3, 'name' => 'Remada curvada', 'sets' => '3', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 1, 'order' => 4, 'name' => 'Desenvolvimento militar', 'sets' => '3', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 1, 'order' => 5, 'name' => 'Prancha', 'sets' => '3', 'reps' => '30-45s', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],

            // Treino B — Inferiores
            ['treino_id' => 2, 'order' => 1, 'name' => 'Leg press', 'sets' => '4', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 2, 'order' => 2, 'name' => 'Afundo (passada)', 'sets' => '3', 'reps' => '10', 'notes' => 'cada perna', 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 2, 'order' => 3, 'name' => 'Mesa flexora', 'sets' => '3', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 2, 'order' => 4, 'name' => 'Cadeira extensora', 'sets' => '3', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 2, 'order' => 5, 'name' => 'Elevacao pelvica', 'sets' => '4', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],

            // Treino C — Superiores
            ['treino_id' => 3, 'order' => 1, 'name' => 'Supino inclinado', 'sets' => '4', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 3, 'order' => 2, 'name' => 'Puxada na barra (pulldown)', 'sets' => '4', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 3, 'order' => 3, 'name' => 'Remada baixa', 'sets' => '3', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 3, 'order' => 4, 'name' => 'Elevacao lateral', 'sets' => '3', 'reps' => '15', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 3, 'order' => 5, 'name' => 'Rosca direta', 'sets' => '3', 'reps' => '12', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],

            // Treino D — Condicionamento + Core
            ['treino_id' => 4, 'order' => 1, 'name' => 'HIIT na esteira/bike', 'sets' => '1', 'reps' => '10-15 min', 'notes' => '30s forte / 60s leve', 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 4, 'order' => 2, 'name' => 'Burpee', 'sets' => '3', 'reps' => '10', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 4, 'order' => 3, 'name' => 'Abdominal infra', 'sets' => '3', 'reps' => '15', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 4, 'order' => 4, 'name' => 'Prancha lateral', 'sets' => '3', 'reps' => '30s', 'notes' => 'cada lado', 'created_at' => $now, 'updated_at' => $now],
            ['treino_id' => 4, 'order' => 5, 'name' => 'Alongamento final', 'sets' => '1', 'reps' => '5 min', 'notes' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('exercicios');
    }
};
