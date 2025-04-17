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
    $city = City::findOrFail($cityId);
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('gym-images', 'public');
        $data['image_path'] = $imagePath;
    }

    elseif ($request->filled('image_url')) {
        $data['image_path'] = $request->input('image_url'); // Could also fetch & store remotely
    }
    else {
        $data['image_path'] = null;
    }
    $data['latitude'] = $request->input('latitude');
    $data['longitude'] = $request->input('longitude');

    $data['is_free'] = $request->input('is_free', false);
    $data['monthly_fee'] = $request->input('monthly_fee');
    $gym = Gym::create($data + ['city_id' => $city->id]);
    if ($request->has('specialties')) {
        $gym->specialties()->attach($request->input('specialties'));
    }
    return response()->json(new GymResource($gym), 201);
    }

    public function update(City $city, $gymId, Request $request)
    {
        $gym = Gym::findOrFail($gymId);
        $this->authorize('update', $gym);
    
        if ($city->id !== $gym->city_id) {
            return response()->json(['message' => 'Gym not found in the specified city'], 404);
        }
    
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:5', 'max:255'],
            'address' => ['required', 'string', 'min:5', 'max:50'],
            'description' => ['required', 'string', 'min:10', 'max:150'],
            'opening_hours' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'], 
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'image_url' => ['nullable', 'url'],
            'is_free' => ['required', 'boolean'],
            'monthly_fee' => ['nullable', 'numeric', 'between:0,99999.99'],
        ]);
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gym-images', 'public');
            $validated['image_path'] = $imagePath;
        } elseif ($request->filled('image_url')) {
            $validated['image_path'] = $request->input('image_url');
        }
        
        if ($request->has('specialties')) {
            $gym->specialties()->sync($request->input('specialties'));
        }
        $gym->update($validated);
        return response()->json(new GymResource($gym), 200);
    }
    
    public function delete(City $city, Gym $gym)
    {
        if($city->id != $gym->city_id) return response(['message' => 'Resource not found'], 404);
        $gym->delete();
        return response('', 204);
    }
}