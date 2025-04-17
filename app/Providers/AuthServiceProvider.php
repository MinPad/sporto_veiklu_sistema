<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider; // Use this
use Illuminate\Support\Facades\Gate;
use App\Models\Gym;
use App\Policies\GymPolicy;
use App\Policies\UserPolicy;
use App\Policies\CoachPolicy;
use App\Policies\CityPolicy;

use App\Models\GymReview;
use App\Policies\GymReviewPolicy;
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
        City::class => CityPolicy::class,
        GymReview::class => GymReviewPolicy::class,
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
