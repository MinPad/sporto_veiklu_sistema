<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\GymController;
use App\Http\Controllers\CoachesController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SportEventController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapboxController;
use App\Http\Controllers\SpecialtyController;
use App\Http\Controllers\GymReviewController;
use App\Http\Controllers\RecommendationController;

use App\Models\User;
use App\Models\SportEvent;
use Illuminate\Support\Facades\Hash;
Route::post('/test/create-user', function (\Illuminate\Http\Request $request) {
    $email = $request->get('email', 'admin@gmail.com');
    $password = $request->get('password', 'Admin123!');
    $role = $request->get('role', 'User');

    $user = \App\Models\User::updateOrCreate(
        ['email' => $email],
        [
            'name' => 'Test User',
            'password' => Hash::make($password),
            'role' => $role,
        ]
    );

    return response()->json(['user' => $user]);
});
Route::post('/test/create-event', function (\Illuminate\Http\Request $request) {
    $gym = \App\Models\Gym::firstOrFail(); // Will throw 500 if no gyms exist

    $event = \App\Models\SportEvent::create([
        'name' => $request->get('name', 'Test Event'),
        'description' => 'E2E test event',
        'location' => 'Test Location',
        'entry_fee' => 0,
        'is_free' => true,
        'start_date' => now()->addDays(1),
        'end_date' => now()->addDays(2),
        'max_participants' => 10,
        'gym_id' => $gym->id,
    ]);

    return response()->json(['event' => $event]);
});


Route::post('/password/email', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);


Route::get('/sports-events', [SportEventController::class, 'index']);
Route::get('/sports-events/filter-options', [SportEventController::class, 'filterOptions']);
Route::get('/sports-events/{id}', [SportEventController::class, 'show']);
Route::middleware('auth:api')->post('/sports-events/{id}/join', [SportEventController::class, 'join']);
Route::middleware('auth:api')->get('/my-sports-events', [SportEventController::class, 'myEvents']);
Route::middleware('auth:api')->post('/sports-events/{id}/leave', [SportEventController::class, 'leave']);
Route::middleware('auth:api')->delete('/sports-events/{sportsEvent}', [SportEventController::class, 'delete']);


// Autherization
// Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/signup', [AuthController::class, 'signup'])->middleware('throttle:10,1');  // 10 requests per minute
Route::post('/login', [AuthController::class, 'login']);
// Route::post('/users/logout', [AuthController::class, 'logout'])->middleware('auth:api');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');

Route::post('/refresh-token', [AuthController::class, 'refresh']);


Route::get('/users', [UserController::class, 'index'])->middleware('auth:api');

Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:api');

Route::get('/user', [UserController::class, 'current'])->middleware('auth:api');

// Route::patch('/users/{user}', [UserController::class, 'update'])->middleware('auth:api','can:update,user');
Route::patch('/users/{user}', [UserController::class, 'update'])->middleware('auth:api');

// Route::delete('/users/{user}', [UserController::class, 'delete'])->middleware('auth:api', 'can:delete,user');
Route::delete('/users/{user}', [UserController::class, 'delete'])->middleware('auth:api');

Route::post('/users/{id}/personalization', [UserController::class, 'updatePersonalization'])->middleware('auth:api');
Route::patch('/user/settings', [UserController::class, 'updateSettings'])->middleware('auth:api');


Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{id}', [CityController::class, 'show']);
Route::delete('/cities/{city}',[CityController::class, 'delete'])->middleware('auth:api');
Route::post('/cities',[CityController::class, 'store'])->middleware('auth:api');

// Route::get('/gyms', [GymController::class, 'index']);
Route::get('/gyms/{gymId}', [GymController::class, 'getGymById'])->middleware('auth:api');
Route::prefix('/cities/{city}')->group(function ()
    {
        Route::get('/gyms', [GymController::class, 'index']);
        Route::get('/gyms/{gym}', [GymController::class, 'show']);
        // Route::post('/hair-salons', [GymController::class, 'store'])->middleware('auth:api', 'can:create,App\Models\Gym', 'valid.json');

        Route::post('/gyms', [GymController::class, 'store'])->middleware('auth:api');

        // Route::put('/gyms/{gym}', [GymController::class, 'update'])->middleware('auth:api', 'can:update,salon', 'valid.json');
        Route::put('/gyms/{gym}', [GymController::class, 'update'])->middleware('auth:api');

        // Route::delete('/gyms/{gym}', [GymController::class, 'delete'])->middleware('auth:api', 'can:delete,salon');
        Route::delete('/gyms/{gym}', [GymController::class, 'delete'])->middleware('auth:api');

        Route::prefix('/gyms/{gym}')->group(function()
        {
            Route::get('/coaches', [CoachesController::class, 'index']);

            // Route::get('/coaches/{coach}', [CoachesController::class, 'show'])->middleware('can:view,coach');
            Route::get('/coaches/{coach}', [CoachesController::class, 'show']);

            // Route::post('/coaches', [CoachesController::class, 'store'])->middleware('auth:api', 'can:create,App\Models\Coach', 'valid.json');
            Route::post('/coaches', [CoachesController::class, 'store'])->middleware('auth:api');
            
            // Route::delete('/coaches/{coach}', [CoachesController::class, 'delete'])->middleware('auth:api', 'can:delete,coach');
            Route::delete('/coaches/{coach}', [CoachesController::class, 'delete'])->middleware('auth:api');
            // Route::put('/coaches/{coach}', [CoachesController::class, 'update'])->middleware('auth:api', 'can:update,coach', 'valid.json');
            Route::put('/coaches/{coach}', [CoachesController::class, 'update'])->middleware('auth:api');
        });
    });
Route::get('/coaches', [CoachesController::class, 'indexAll']);
Route::get('/coaches/{coach}', [CoachesController::class, 'showSingle'])->middleware('auth:api');
Route::middleware('auth:api')->post('/coaches', [CoachesController::class, 'storeWithoutGym']);
Route::middleware('auth:api')->delete('/coaches/{coach}', [CoachesController::class, 'deleteCoach']);
Route::middleware('auth:api')->put('/coaches/{coach}', [CoachesController::class, 'updateCoach']);


//MAPBOX
Route::get('/mapbox/distance', [MapboxController::class, 'getDistance']);


//GYM SPECIALTYS
Route::get('/specialties', [SpecialtyController::class, 'index']);

//admin
Route::post('/specialties', [SpecialtyController::class, 'store'])->middleware('auth:api');
Route::delete('/specialties/{id}', [SpecialtyController::class, 'destroy'])->middleware('auth:api');


//--------------------------------------------------------reviews
Route::middleware('auth:api')->group(function () {
    Route::post('/gyms/{gym}/reviews', [GymReviewController::class, 'store']);

    Route::put('/reviews/{review}', [GymReviewController::class, 'update']);

    Route::delete('/reviews/{review}', [GymReviewController::class, 'destroy']);
});

Route::get('/gyms/{gym}/reviews', [GymReviewController::class, 'index']);


Route::middleware(['auth:api'])->get('/recommendations', [RecommendationController::class, 'index']);