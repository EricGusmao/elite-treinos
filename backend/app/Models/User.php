<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

final class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function authenticate(string $email, string $password): ?self
    {
        if (! Auth::attempt(['email' => $email, 'password' => $password])) {
            return null;
        }

        return Auth::user();
    }

    public function isSuperadmin(): bool
    {
        return $this->role === Role::Superadmin;
    }

    public function isPersonal(): bool
    {
        return $this->role === Role::Personal;
    }

    public function isAluno(): bool
    {
        return $this->role === Role::Aluno;
    }

    public function personal(): HasOne
    {
        return $this->hasOne(Personal::class);
    }

    public function aluno(): HasOne
    {
        return $this->hasOne(Aluno::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
        ];
    }
}
