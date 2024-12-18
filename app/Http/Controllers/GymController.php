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
use Illuminate\Support\Facades\Storage;

use App\Policies\UserPolicy;
class GymController extends Controller
{
    use AuthorizesRequests;
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

    public function store($cityId, CreateGymRequest $request)
    {
    $this->authorize('create', Gym::class);

    try {
        $city = City::findOrFail($cityId);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'City not found'], 404);
    }
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $filePath = $request->file('image')->store('gym-images', 'public');
        $data['image_url'] = asset('storage/' . $filePath);
    } elseif ($request->filled('image_url')) {
        $data['image_url'] = $request->input('image_url');
    } else {
        $data['image_url'] = null; // Replace with a default URL if needed
    }

    $gym = Gym::create($data + ['city_id' => $city->id]);

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
    
        $gym = Gym::find($gymId);
        $this->authorize('update', $gym); 
        if (!$gym) {
            return response()->json(['message' => 'Gym not found'], 404);
        }
        if ($city->id !== $gym->city_id) {
            return response()->json(['message' => 'Gym not found in the specified city'], 404);
        }
    
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