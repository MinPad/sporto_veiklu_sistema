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
        $city = City::find($cityId);
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }
        $gym = Gym::find($gymId);
    
        if (!$gym) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        if ($gym->city_id != $city->id) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        return response()->json(CoachResource::collection($gym->coaches), 200);
    }
    
    public function show($cityId, $gymId, $coachId)
    {

        $city = City::find($cityId);
    
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }

        $gym = Gym::find($gymId);
    
        if (!$gym) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }

        try {
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
    public function update($cityId, $gymId, $coachId, UpdateCoachRequest $request)
    {
        $this->authorize('update', Coach::class);
        try {
            $data = json_decode($request->getContent(), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid JSON format'], 422);
        }
    
        $city = City::find($cityId);
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }
    
        $gym = Gym::find($gymId);
        if (!$gym || $gym->city_id != $city->id) {
            return response()->json(['message' => 'There is no gym with that index in the city'], 404);
        }
    
        $coach = Coach::find($coachId);
        if (!$coach || $coach->gym_id != $gym->id) {
            return response()->json(['message' => 'There is no coach with that index'], 404);
        }
    
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