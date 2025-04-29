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

    public function index(Request $request, $cityId, $gymId)
    {
        $city = City::find($cityId);
        if (!$city) {
            return response()->json(['message' => 'City not found'], 404);
        }
    
        $gym = Gym::find($gymId);
        if (!$gym || $gym->city_id != $city->id) {
            return response()->json(['message' => 'Gym not found in this city'], 404);
        }
    
        $query = $gym->coaches()->with(['gym', 'specialties']);
    
        if ($request->filled('approval_status')) {
            if ($request->approval_status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->approval_status === 'pending') {
                $query->where('is_approved', false);
            }
        }
    
        if ($request->has('specialty_ids') && is_array($request->specialty_ids) && count($request->specialty_ids) > 0) {
            $query->whereHas('specialties', function ($q) use ($request) {
                $q->whereIn('specialties.id', $request->specialty_ids);
            });
        }
    
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->whereRaw("LOWER(CONCAT(name, ' ', surname)) LIKE ?", ["%$search%"]);
        }
    
        return CoachResource::collection(
            $query->paginate($request->get('per_page', 9))
        );
    }
    
    public function indexAll(Request $request)
    {
        $query = Coach::with(['gym.city', 'specialties']);
    
        if ($request->filled('city_id')) {
            $query->whereHas('gym', function ($q) use ($request) {
                $q->where('city_id', $request->city_id);
            });
        }
    
        if ($request->filled('gym_id')) {
            $query->where('gym_id', $request->gym_id);
        }
    
        if ($request->filled('specialty_ids')) {
            $query->whereHas('specialties', function ($q) use ($request) {
                $q->whereIn('specialties.id', $request->specialty_ids);
            });
        }
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%$search%"])
                  ->orWhereRaw('LOWER(surname) LIKE ?', ["%$search%"]);
            });
        }
        
        return CoachResource::collection(
            $query->paginate($request->get('per_page', 9))
        );
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
        return response()->json(['message' => 'There is no coach with that index'], 404);

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
    public function updateCoach(UpdateCoachRequest  $request, Coach $coach)
    {
        $this->authorize('update', $coach);

        $validated = $request->validated();
                
    if (!empty($validated['gym_id'])) {
        $gym = \App\Models\Gym::find($validated['gym_id']);
        if (!$gym) {
            return response()->json(['message' => 'Selected gym not found'], 404);
        }
    }
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