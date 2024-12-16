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
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class UserController extends Controller
{   
    use AuthorizesRequests;
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return response()->json(UserResource::collection(User::all()), 200);
    }
    public function show($id)
    {
    try {
        $user = User::findOrFail($id);

        // error_log('Authorization check: ' . json_encode([
        //     'loggedInUser' => auth()->user(),
        //     'targetUser' => $user,
        // ]));

        $this->authorize('view', $user);
        return new UserResource($user);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
    }
    }
    public function current()
    {
    try {
        $user = auth()->user(); // Automatically gets the currently authenticated user
        return new UserResource($user);
    } catch (Exception $e) {
        return response()->json(['message' => 'Unable to fetch user data'], 500);
    }
    }
    public function update($id, Request $request)
    {
        // logger('Update method hit');
        // logger($request->all());
        try {
            

            $data = json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
        
        try {
            // Find the user by ID
            $user = User::findOrFail($id);
            $this->authorize('update', $user);

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
        $this->authorize('delete', $user);
        try {
            $user->delete();
            return response('', 204);

        } catch (ModelNotFoundException $e) {
            // If the user is not found, return a 404 error message
            return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
        }
       
        // auth()->invalidate();
        // return response()->json(['message' => 'User deleted successfully.'], 200);
    }
}