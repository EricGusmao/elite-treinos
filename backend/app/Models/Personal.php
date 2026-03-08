<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

final class Personal extends Model
{
    use HasFactory;

    protected $table = 'personais';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'phone',
        'cref',
    ];

    /**
     * @param  array<string, mixed>  $attributes
     */
    public static function createWithUser(array $attributes): self
    {
        return DB::transaction(function () use ($attributes): self {
            $user = User::query()->create([
                'name' => $attributes['nome'],
                'email' => $attributes['email'],
                'password' => $attributes['password'],
                'role' => Role::Personal,
            ]);

            $personal = self::query()->create([
                'user_id' => $user->id,
                'phone' => $attributes['telefone'],
                'cref' => $attributes['cref'] ?? null,
            ]);

            $personal->load('user');

            return $personal;
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
                'phone' => $attributes['telefone'],
                'cref' => $attributes['cref'] ?? null,
            ]);
        });

        $this->load('user');
    }

    public function deleteWithUser(): void
    {
        $this->user->delete();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function alunos(): HasMany
    {
        return $this->hasMany(Aluno::class);
    }
}
