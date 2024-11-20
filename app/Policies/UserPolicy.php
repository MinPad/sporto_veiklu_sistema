<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
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
    public function view(User $loggedInUser, User $targetUser)
    {
        // dd($loggedInUser, $targetUser);
        // error_log('Authorization check: ' . json_encode([
        //     'loggedInUser' => $loggedInUser,
        //     'targetUser' => $targetUser,
        // ]));

        if ($loggedInUser->role === 'Admin') {
            return true;
        }
        return $loggedInUser->id === $targetUser->id;

        // return $loggedInUser->role === 'Admin' || $loggedInUser->id === $targetUser->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $loggedInUser, User $targetUser)
    {
        return $loggedInUser->id === $targetUser->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $loggedInUser, User $targetUser)
    {
        if ($loggedInUser->role === 'Admin') {
            return true;
        }
        return $loggedInUser->id === $targetUser->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        //
    }
}
