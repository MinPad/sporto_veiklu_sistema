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
use App\Http\Requests\UpdateUserPersonalizationRequest;
class UserController extends Controller
{   
    use AuthorizesRequests;
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::paginate(9);

        return UserResource::collection($users);
    }
    public function show($id)
    {
    try {
        $user = User::findOrFail($id);

        $this->authorize('view', $user);
        return new UserResource($user);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
    }
    }
    public function current()
    {
        try {
            $user = auth()->user();
            return (new UserResource($user))->response()->setStatusCode(200);
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
            $user = User::findOrFail($id);
            $this->authorize('update', $user);

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
    
            $user->update($data);
    
            return (new UserResource($user))->response()->setStatusCode(200);
    
        } catch (ModelNotFoundException $e) {
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
            return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
        }
       
    }
    public function updatePersonalization(UpdateUserPersonalizationRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);
    
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }
    
        if ($request->hasFile('cover_photo')) {
            $coverPath = $request->file('cover_photo')->store('covers', 'public');
            $user->cover_photo = $coverPath;
        }
    
        if ($request->input('remove_avatar') === 'true') {
            $user->avatar = null;
        }
    
        $user->motivational_text = $request->input('motivational_text', '');
    
        $user->goal = $request->input('goal');
        $user->height = $request->input('height');
        $user->weight = $request->input('weight');
        $user->experience_level = $request->input('experience_level');
        $user->preferred_workout_types = $request->input('preferred_workout_types', []);

        $user->personalization_updated_at = now();
        $user->save();
    
        return new UserResource($user);
    }
    public function updateSettings(Request $request)
    {
        $user = auth()->user();
    
        $request->validate([
            'disable_welcome_modal' => 'required|boolean',
        ]);
    
        $user->update([
            'disable_welcome_modal' => $request->disable_welcome_modal,
        ]);
    
        return (new UserResource($user))->response()->setStatusCode(200);
    }
    
    
}