<?php

namespace App\Policies;

use App\Models\City;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CityPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, City $city): bool
    {
        //
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
    public function update(User $user, City $city): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, City $city)
    {
        return $user->role === 'Admin'; 
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, City $city): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, City $city): bool
    {
        //
    }
}
