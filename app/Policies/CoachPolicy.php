<?php

namespace App\Policies;

use App\Models\Coach;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoachPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'Admin';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Coach $coach): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user)
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user)
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Coach $coach): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Coach $coach): bool
    {
        //
    }
}
