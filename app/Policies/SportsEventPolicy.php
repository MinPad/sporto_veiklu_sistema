<?php

namespace App\Policies;

use App\Models\SportsEvent;
use App\Models\User;

class SportsEventPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SportsEvent $sportsEvent): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'Admin';
    }

    public function update(User $user, SportsEvent $sportsEvent): bool
    {
        return $user->role === 'Admin';
    }

    public function delete(User $user, SportsEvent $sportsEvent): bool
    {
        return $user->role === 'Admin';
    }

    public function restore(User $user, SportsEvent $sportsEvent): bool
    {
        return false;
    }

    public function forceDelete(User $user, SportsEvent $sportsEvent): bool
    {
        return false;
    }
}