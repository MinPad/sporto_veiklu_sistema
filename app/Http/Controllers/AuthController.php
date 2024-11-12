<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Exception;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // public function signup(SignupRequest $request)
    // {
    //     // Validate the request data
    //     $data = $request->validated();
    
    //     // @var \App\Models\User $user
    //     try {
    //         // Attempt to create a new user
    //         $user = User::create([
    //             'name' => $data['name'],
    //             'email'=> $data['email'],
    //             'password' => Hash::make($data['password']),
    //         ]);
    
    //         return response()->json([
    //             'message' => 'Signup successful!',
    //             'user' => $user,
    //         ], 201);
    //     } catch (\Illuminate\Database\QueryException $e) {
    //         // Handle specific database errors
    //         if ($e->getCode() === '23000') { // Unique constraint violation
    //             return response()->json([
    //                 'message' => 'Email already registered.',
    //             ], 422); // Return 422 for validation errors like unique constraint violation
    //         }
    //         // Log unexpected database errors
    //         Log::error('Database error during signup', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'message' => 'An unexpected database error occurred. Please try again later.',
    //         ], 500);
    //     } catch (Exception $e) {
    //         // Log general errors
    //         Log::error('Error during user signup', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'message' => 'An unexpected error occurred. Please try again later.',
    //         ], 500);
    //     }
    // }
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

    // Attempt to create a new user
        $user = User::create([
            'name' => $data['name'],
            'email'=> $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Signup successful!',
            'user' => $user,
        ], 201);
    }

    

    // public function login(LoginRequest $request)
    // {
    //     $credentials = $request->validated();

    //     $remember = $credentials['remember'] ?? false;
    //     unset($credentials['remember']);

    //     if(!Auth::attempt($credentials, $remember)) {
    //         return response([
    //             'error' => 'The Provided credentials are not correct'
    //         ], 422);
    //     }
    //     $user = Auth::user();
    //     $token = $user->createToken('main')->plainTextToken;

    //     return response([
    //         'user' => $user,
    //         'token'=> $token
    //     ]);
    // }

    // public function login(LoginRequest $request)
    // {
    // // Validate the request data
    // $credentials = $request->validated();

    // // Check if the user exists in the database based on the provided email
    // $user = User::where('email', $credentials['email'])->first();

    // // If user is not found or password is incorrect
    // if (!$user || !Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']], $credentials['remember'] ?? false)) {
    //     return response()->json([
    //         'error' => 'Invalid credentials. Please check your email and password.'
    //     ], 422);
    // }

    // // User successfully authenticated, create a token
    // $token = $user->createToken('main')->plainTextToken;

    // // Return the authenticated user and their token
    // return response()->json([
    //     'user' => $user,
    //     'token' => $token
    // ], 200);
    // }
    public function login(LoginRequest $request)
    {
    $credentials = $request->validated();

    // Attempt to authenticate the user with the given credentials
    if (!$token = auth()->attempt($credentials)) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
        ], 401);
    }

    // Generate a unique refresh token
    $refreshToken = Str::random(60);

    auth()->user()->refreshTokens()->create([
        'token' => $refreshToken,
        'expires_at' => now()->addMinutes(config('jwt.refresh_ttl')), 
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'accessToken' => $token, 
        'tokenType' => 'bearer',
        'expiresIn' => auth()->factory()->getTTL() * 60, // Time in seconds until token expiration
    ])->cookie('refreshToken', $refreshToken, config('jwt.refresh_ttl') * 60, null, null, true, true);
    }



    
    
    

    public function refresh()
    {
        try {
            $newAccessToken = auth()->refresh();
    
            return response()->json([
                'message' => 'Token successfully refreshed',
                'accessToken' => $newAccessToken,
                'tokenType' => 'bearer',
                'expiresIn' => auth()->factory()->getTTL() * 60,
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Invalid or expired refresh token'
            ], 401);
        }
    }
    
    

    public function logout()
    {
        auth()->logout();
        return response(['message' => 'Successfully logged out'], 200);
    }
    
}
