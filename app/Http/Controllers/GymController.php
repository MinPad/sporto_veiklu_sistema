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

    public function store($cityId, CreateGymRequest $request)
    {
    // Authorization: Ensures the user has the required permissions
    $this->authorize('create', Gym::class);

    // Validate and find the city
    try {
        $city = City::findOrFail($cityId);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'City not found'], 404);
    }

    // Retrieve validated input data from the request
    $data = $request->validated();

    // Handle the image file or URL
    if ($request->hasFile('image')) {
        // Store the uploaded file in the 'public/gym-images' directory
        $filePath = $request->file('image')->store('gym-images', 'public');
        // Generate a public URL for the stored file
        $data['image_url'] = asset('storage/' . $filePath);
    } elseif ($request->filled('image_url')) {
        // Use the external image URL provided
        $data['image_url'] = $request->input('image_url');
    } else {
        // If no image is provided, you can set a default placeholder (optional)
        $data['image_url'] = null; // Replace with a default URL if needed
    }

    // Create a new gym record associated with the city
    $gym = Gym::create($data + ['city_id' => $city->id]);

    // Return a JSON response with the created gym resource
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