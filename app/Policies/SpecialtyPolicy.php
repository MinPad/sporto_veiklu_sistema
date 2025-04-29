<?php

namespace App\Policies;

use App\Models\Specialty;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SpecialtyPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Specialty $specialty): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'Admin';
    }

    public function update(User $user, Specialty $specialty): bool
    {
        return $user->role === 'Admin';
    }

    public function delete(User $user, Specialty $specialty): bool
    {
        return $user->role === 'Admin';
    }
}
