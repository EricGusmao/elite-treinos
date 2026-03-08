<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

final class AlunoTreino extends Pivot
{
    public $incrementing = true;

    protected $table = 'aluno_treino';

    public function aluno(): BelongsTo
    {
        return $this->belongsTo(Aluno::class);
    }

    public function treino(): BelongsTo
    {
        return $this->belongsTo(Treino::class);
    }

    public function personal(): BelongsTo
    {
        return $this->belongsTo(Personal::class);
    }

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
        ];
    }
}
