<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider; // Use this
use Illuminate\Support\Facades\Gate;
use App\Models\Gym;
use App\Policies\GymPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Gym::class => GymPolicy::class,  // Ensure Gym model is mapped to its policy
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
