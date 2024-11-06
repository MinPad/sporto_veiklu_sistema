<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\AuthenticateUserRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    // public function show(User $user)
    // {
    //     return new UserResource($user);
    // }
    public function show($id)
    {
    try {
        $user = User::findOrFail($id);
        return new UserResource($user);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
    }
    }
    public function update($id, Request $request)
    {
        // Check if the request is JSON and decode it
        try {
            $data = json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
    
        try {
            // Find the user by ID
            $user = User::findOrFail($id);
    
            // Hash password if it's in the request
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
    
            // Update user with valid data
            $user->update($data);
    
            // Return the updated resource
            return (new UserResource($user))->response()->setStatusCode(200);
    
        } catch (ModelNotFoundException $e) {
            // If the user is not found, return a 404 error message
            return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
        }
    }
    
    
    public function delete(User $user)
    {
        $user->delete();
        // auth()->invalidate();
        return response('', 204);
        // return response()->json(['message' => 'User deleted successfully.'], 200);
    }
}