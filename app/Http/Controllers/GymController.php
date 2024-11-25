<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGymRequest;
use App\Http\Requests\UpdateGymRequest;
use App\Models\City;
use App\Models\User;
use App\Models\Gym;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Http\Resources\GymResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Gate;

use App\Policies\UserPolicy;
class GymController extends Controller
{
    use AuthorizesRequests;
    // public function index(City $city = null, User $manager = null)
    // {
    //     if (is_null($city) || !$city->exists) {
    //         return response()->json(['message' => 'City not found'], 404);
    //     }
    
    //     return response()->json(GymResource::collection($city->gyms()->with('city')->get()), 200);
    // }
    public function index($cityId, User $manager = null)
    {
    $city = City::find($cityId);

    if (!$city) {
        return response()->json(['message' => 'City not found'], 404);
    }

    return response()->json(GymResource::collection($city->gyms()->with('city')->get()), 200);
    }


    public function show($cityId, Gym $gym)
    {
        $city = City::find($cityId);

        if (!$city) {
        return response()->json(['message' => 'City not found'], 404);
    }
        if($city->id != $gym->city_id) return response(['message' => 'There is no gym with that index in the city'], 404);
        return response()->json(new GymResource($gym), 200);
    }

    // public function store(City $city, CreateGymRequest $request)
    // {
    //     $request->merge(['city_id' => $city->id]);

    //     try {
    //         $gym = Gym::create($request->all());
    //         return response()->json(new GymResource($gym), 201);
    //     } catch (QueryException $e) {
    //         return response()->json(['message' => 'Error creating gym: ' . $e->getMessage()], 500);
    //     }
    // }
    public function store($cityId, CreateGymRequest $request)
    {
        // Check if the user is authorized to create a gym
        // try {
            $this->authorize('create', Gym::class);  // Using the policy method
        // } catch (AuthorizationException $e) {
            // return response()->json(['message' => 'You are not authorized to create a gym.'], 403);
        // }
        // if (Gate::denies('create', Gym::class)) {
        //     return response()->json(['message' => 'You are not authorized to create a gym.'], 403);
        // }
        // Check if JSON is valid
        try {
            json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
    
        // Fetch city manually
        try {
            $city = City::findOrFail($cityId);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'City not found'], 404);
        }
    
        // Create gym
        $gym = Gym::create($request->validated() + ['city_id' => $city->id]);
    
        // Return response
        return response()->json(new GymResource($gym), 201);
    }
    
    
    

    public function update(City $city, $gymId, UpdateGymRequest $request)
    {
        // Validate JSON input
        try {

            $data = json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
    
        // Manually find the gym to prevent automatic 404 exception
        $gym = Gym::find($gymId);
        $this->authorize('update', $gym); 
        // Check if the gym exists
        if (!$gym) {
            return response()->json(['message' => 'Gym not found'], 404);
        }
    
        // Check if the gym belongs to the city
        if ($city->id !== $gym->city_id) {
            return response()->json(['message' => 'Gym not found in the specified city'], 404);
        }
    
        // Update gym data
        $gym->update($request->validated());
        return response()->json(new GymResource($gym), 200);
    }
    
    

    public function delete(City $city, Gym $gym)
    {
        if($city->id != $gym->city_id) return response(['message' => 'Resource not found'], 404);
        $gym->delete();
        return response('', 204);
    }
}