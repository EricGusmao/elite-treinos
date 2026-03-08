<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Exercicio extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'treino_id',
        'order',
        'name',
        'sets',
        'reps',
        'notes',
    ];

    public function treino(): BelongsTo
    {
        return $this->belongsTo(Treino::class);
    }
}
