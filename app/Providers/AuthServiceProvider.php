<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider; // Use this
use Illuminate\Support\Facades\Gate;
use App\Models\Gym;
use App\Policies\GymPolicy;
use App\Policies\UserPolicy;
use App\Policies\CoachPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Gym::class => GymPolicy::class,  // Ensure Gym model is mapped to its policy
        User::class => UserPolicy::class,
        Coach::class => CoachPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        // Register the policies
        $this->registerPolicies();
    }
}
