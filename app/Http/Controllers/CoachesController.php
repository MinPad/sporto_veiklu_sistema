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
use Illuminate\Support\Str;
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
    public function indexAll()
    {
        $coaches = Coach::with('gym')->get(); // if you want gym info too
        return response()->json(CoachResource::collection($coaches), 200);
    }
    public function showSingle(Coach $coach)
    {
        $this->authorize('view', $coach);

        $coach->load(['specialties', 'gym']);

        return response()->json(new CoachResource($coach), 200);
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

        $validated = $request->validated();

        $coach = Coach::create($validated + [
            'gym_id' => $gym->id,
        ]);

        if ($request->has('specialties')) {
            $coach->specialties()->sync($validated['specialties']);
        }

        return response()->json(new CoachResource($coach), 201);
    }

    public function storeWithoutGym(CreateCoachRequest $request)
    {
        $this->authorize('create', Coach::class);
    
        // \Log::info('Creating coach with data:', $request->all());
    
        $coach = new Coach($request->validated());
        $coach->save(); // If you fixed the model, this is enough
    
        try {
            if ($request->has('specialties')) {
                $specialtyIds = $request->input('specialties');
                // \Log::info('Attaching specialties to coach ID ' . $coach->id, $specialtyIds);
                $coach->specialties()->attach($specialtyIds);
            }
        } catch (\Throwable $e) {
            \Log::error('Failed to attach specialties to coach ID ' . $coach->id, [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
        }
    
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
        
        $validated = $request->validated();
        $coach->update($validated);

        if ($request->has('specialties')) {
            $coach->specialties()->sync($validated['specialties']);
        }
        return response()->json(new CoachResource($coach), 200);
    }
    public function updateCoach(Request $request, Coach $coach)
    {
        $this->authorize('update', $coach);
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'is_approved' => 'boolean',
            'gym_id' => 'nullable|exists:gyms,id',
            'specialties' => 'array',
            'specialties.*' => 'integer|exists:specialties,id',
        ]);
    
        $coach->update($validated);
    
        if ($request->has('specialties')) {
            $coach->specialties()->sync($validated['specialties']);
        }
    
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
    public function deleteCoach(Coach $coach)
    {
        $this->authorize('delete', Coach::class);
    
        try {
            $coach->delete();
            return response()->json('', 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete coach'], 500);
        }
    }
    
}