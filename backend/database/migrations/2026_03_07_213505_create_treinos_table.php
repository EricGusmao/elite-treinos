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
        Schema::create('treinos', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('objective');
            $table->timestamps();
        });

        $now = now();

        DB::table('treinos')->insert([
            ['id' => 1, 'code' => 'A', 'name' => 'Treino A — Full Body (Base)', 'objective' => 'Adaptacao geral e base de forca', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'code' => 'B', 'name' => 'Treino B — Inferiores (Pernas/Gluteos)', 'objective' => 'Foco em pernas e gluteos', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'code' => 'C', 'name' => 'Treino C — Superiores (Peito/Costas/Ombros)', 'objective' => 'Hipertrofia de tronco', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'code' => 'D', 'name' => 'Treino D — Condicionamento + Core', 'objective' => 'Condicionamento e core', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('treinos');
    }
};
