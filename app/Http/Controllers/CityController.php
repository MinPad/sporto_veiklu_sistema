<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use App\Http\Resources\CityResource;
use App\Http\Requests\CreateCityRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class CityController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        return response()->json(CityResource::collection(City::all()), 200);
    }
    public function store(CreateCityRequest $request)
    {
        $this->authorize('create', City::class);  
    
        $data = json_decode($request->getContent(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['message' => 'Invalid JSON'], 422);
        }
    
        $city = City::create($request->validated());
    
        return response()->json(new CityResource($city), 201);
    }
    public function show($id)
    {
        try {
            // \Log::error('Joining event:',['id' => $id]);
            $city = City::findOrFail($id);
            // \Log::error('Joining event:',['city' => $city]);
            return response()->json(new CityResource($city), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'A city with this ID doesn\'t exist'], 404);
        }
    }
    public function delete(City $city)
    {
        $this->authorize('delete', $city); 
        if (!$city->id) {
            return response(['message' => 'Resource not found'], 404);
        }
        $city->delete();
        return response('', 204);
    }
    
}