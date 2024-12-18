<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Exception;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

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
    public function login(LoginRequest $request)
    {
    $credentials = $request->validated();

    if (!$token = auth()->attempt($credentials)) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
        ], 401);
    }

    $refreshToken = auth()->setTTL(config('jwt.refresh_ttl'))->attempt($credentials);
    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'accessToken' => $token, 
        'refreshToken' => $refreshToken,
        'tokenType' => 'bearer',
        'accessExpiresIn' => auth()->factory()->getTTL() * 60,
        'refreshExpiresIn' => config('jwt.refresh_ttl') * 60, 
    ]);
    
    }
    
    public function refresh()
    {
    try {
        // Use the token from the Authorization header OR from the request body
        $token = request()->bearerToken() ?? request('refreshToken');
        
        if (!$token) {
            return response()->json(['message' => 'Refresh token is missing'], 400);
        }
        // \Log::info('Received Token for Refresh:', ['token' => $token]);
        // Manually set the token for refreshing
        $newAccessToken = auth()->setToken($token)->refresh();

        return response()->json([
            'message' => 'Token successfully refreshed',
            'accessToken' => $newAccessToken,
            'tokenType' => 'bearer',
            'expiresIn' => auth()->factory()->getTTL() * 60,
        ]);
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['message' => 'Refresh token expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['message' => 'Invalid refresh token'], 401);
    } catch (JWTException $e) {
        return response()->json(['message' => 'Could not refresh token'], 500);
    }
    }

    public function logout()
    {
        auth()->logout();
        return response(['message' => 'Successfully logged out'], 200);
    }
}