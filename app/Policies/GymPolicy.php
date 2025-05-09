<?php

namespace App\Policies;

use App\Models\Gym;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GymPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Gym $gym): bool
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
    public function update(User $user, Gym $gym): bool
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Gym $gym): bool
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Gym $gym): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Gym $gym): bool
    {
        //
    }
}
