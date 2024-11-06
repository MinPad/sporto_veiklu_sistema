<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use App\Http\Resources\CityResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CityController extends Controller
{
    public function index()
    {
        return response()->json(CityResource::collection(City::all()), 200);
    }
    // public function index()
    // {
    //     return response()->json(['message' => 'Cities retrieved successfully!'], 200);
    // }


    public function show($id)
    {
        try {
            $city = City::findOrFail($id);
            return response()->json(new CityResource($city), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'A city with this ID doesn\'t exist'], 404);
        }
    }
    
}
