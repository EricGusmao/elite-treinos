<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class Aluno extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'personal_id',
        'birth_date',
        'notes',
    ];

    /**
     * @param  array<string, mixed>  $attributes
     */
    public static function createForPersonal(Personal $personal, array $attributes): self
    {
        return DB::transaction(function () use ($personal, $attributes): self {
            $user = User::query()->create([
                'name' => $attributes['nome'],
                'email' => $attributes['email'],
                'password' => $attributes['password'],
                'role' => Role::Aluno,
            ]);

            $aluno = self::query()->create([
                'user_id' => $user->id,
                'personal_id' => $personal->id,
                'birth_date' => $attributes['data_nascimento'] ?? null,
                'notes' => $attributes['observacoes'] ?? null,
            ]);

            $aluno->load(['user', 'treinos']);

            return $aluno;
        });
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function updateWithUser(array $attributes): void
    {
        DB::transaction(function () use ($attributes): void {
            $this->user->update(array_filter([
                'name' => $attributes['nome'],
                'email' => $attributes['email'],
                'password' => $attributes['password'] ?? null,
            ]));

            $this->update([
                'birth_date' => $attributes['data_nascimento'] ?? null,
                'notes' => $attributes['observacoes'] ?? null,
            ]);
        });

        $this->load(['user', 'treinos']);
    }

    public function deleteWithUser(): void
    {
        $this->user->delete();
    }

    public function assignTreino(int $treinoId, Personal $personal): Treino
    {
        if ($this->treinos()->count() >= 2) {
            throw ValidationException::withMessages([
                'treino_id' => ['O aluno já possui o máximo de 2 treinos atribuídos.'],
            ]);
        }

        if ($this->hasTreino($treinoId)) {
            throw ValidationException::withMessages([
                'treino_id' => ['Este treino já está atribuído ao aluno.'],
            ]);
        }

        $this->treinos()->attach($treinoId, [
            'personal_id' => $personal->id,
            'assigned_at' => now(),
        ]);

        return Treino::query()->with('exercicios')->findOrFail($treinoId);
    }

    public function removeTreino(int $treinoId): void
    {
        $this->treinos()->detach($treinoId);
    }

    public function hasTreino(int $treinoId): bool
    {
        return $this->treinos()->where('treino_id', $treinoId)->exists();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function personal(): BelongsTo
    {
        return $this->belongsTo(Personal::class);
    }

    public function treinos(): BelongsToMany
    {
        return $this->belongsToMany(Treino::class, 'aluno_treino')
            ->withPivot('personal_id', 'assigned_at')
            ->withTimestamps();
    }

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }
}
