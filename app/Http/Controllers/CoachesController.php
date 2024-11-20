<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCoachRequest;
use App\Models\City;
use App\Models\Gym;
use App\Models\Coach;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Http\Resources\CoachResource;
use App\Http\Requests\CreateCoachRequest;
// use App\Http\Requests\UpdateHairdresserRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CoachesController extends Controller
{
    use AuthorizesRequests;
    public function index($cityId, $gymId)
    {
        // Find the city based on the passed city ID
        $city = City::find($cityId);
    
        // Check if the city exists
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }
    
        // Find the gym by ID
        $gym = Gym::find($gymId);
    
        // Check if the gym exists
        if (!$gym) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        // Check if the gym belongs to the city
        if ($gym->city_id != $city->id) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        // Return the coaches associated with the gym
        return response()->json(CoachResource::collection($gym->coaches), 200);
    }
    

    // public function show(City $city, Gym $gym, Coach $coach)
    // {
    //     try {
    //         if($city->id !=  $gym->city_id || $gym->id != $coach->gym_id) {
    //             return response()->json(['message' => 'Resource not found'], 404);
    //         }
    //         return response()->json(new CoachResource($coach), 200);
    //     } catch (ModelNotFoundException $e) {
    //         return response()->json(['message' => 'Coach with this id doesn\'t exist'], 404);
    //     }
    // }
    public function show($cityId, $gymId, $coachId)
    {

        $city = City::find($cityId);
    
        // Check if the city exists
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }

        $gym = Gym::find($gymId);
    
        // Check if the gym exists
        if (!$gym) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }

        try {
        // Manually find the coach instead of using route model binding
        $coach = Coach::where('gym_id', $gym->id)->findOrFail($coachId);

        if ($city->id !=  $gym->city_id) {
            return response()->json(['message' => 'Resource not found'], 404);
        }

        return response()->json(new CoachResource($coach), 200);

    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Coach with this id doesn\'t exist'], 404);
    }
    }


    public function store(City $city, Gym $gym, CreateCoachRequest $request)
    {
        $this->authorize('create', Coach::class);
        if ($city->id !== $gym->city_id) {
        return response()->json(['message' => 'Resource not found'], 404);
        }

        $coach = Coach::create($request->validated() + [
        'gym_id' => $gym->id,
        ]);

        return response()->json(new CoachResource($coach), 201);
    }



    // public function store(City $city, Gym $gym, CreateCoachRequest $request)
    // {
    // // Check if the gym belongs to the correct city
    //     if ($city->id != $gym->city_id) {
    //         return response()->json(['message' => 'Resource not found'], 404);
    //     }

    // // Extract the user ID from the JWT payload and add gym ID to the request
    //     $payload = auth()->payload();
    //     $request->merge([
    //         'id' => (int) $payload['sub'], // Assuming this is the coach/user ID
    //         'gym_id' => $gym->id
    //     ]);

    //     try {
    //     // Create the coach with validated data
    //         $coach = Coach::create($request->validated());
    //         return response()->json(new CoachResource($coach), 201);
    //     } catch (QueryException $e) {
    //     // Handle possible uniqueness constraint violation or other DB issues
    //         return response()->json(['message' => 'A coach waith this name, surname, and specialty already exists in this gym.'], 409);
    //     }
    // }

    // public function update(City $city, Gym $gym, Coach $coach, UpdateCoachRequest $request)
    // {
    //     // Check if the gym belongs to the city and if the coach belongs to the gym
    //     if ($city->id != $gym->city_id || $gym->id != $coach->gym_id) {
    //         return response()->json(['message' => 'Resource not found'], 404);
    //     }
    
    //     // Update the coach with only the provided (validated) attributes
    //     $coach->update($request->validated());
    
    //     // Return the updated coach resource
    //     return response()->json(new CoachResource($coach), 200);
    // }

    public function update($cityId, $gymId, $coachId, UpdateCoachRequest $request)
    {
        $this->authorize('update', Coach::class);
        // Check if the request is JSON and decode it
        try {
            $data = json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
    
        // Check if the city exists
        $city = City::find($cityId);
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }
    
        // Check if the gym exists in the city
        $gym = Gym::find($gymId);
        if (!$gym || $gym->city_id != $city->id) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        // Check if the coach exists in the gym
        $coach = Coach::find($coachId);
        if (!$coach || $coach->gym_id != $gym->id) {
            return response()->json(['message' => 'There is no coach with that index'], 404);
        }
    
        // Proceed with updating the coach
        $coach->update($request->validated());
        return response()->json(new CoachResource($coach), 200);
    }
    
    
    public function delete(City $city, Gym $gym, Coach $coach)
    {
        $this->authorize('delete', Coach::class);
        if ($city->id != $gym->city_id || $gym->id != $coach->gym_id) {
            return response()->json(['message' => 'Resource not found'], 404);
        }
    
        try {
            $coach->delete();
            return response()->json('', 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete coach'], 500);
        }
    }
    
}