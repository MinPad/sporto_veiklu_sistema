<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use App\Http\Resources\SpecialtyResource;

class SpecialtyController extends Controller
{
    public function index()
    {
        return response()->json(SpecialtyResource::collection(Specialty::all()), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:specialties,name|max:255',
        ]);

        $specialty = Specialty::create([
            'name' => $request->input('name'),
        ]);

        return response()->json($specialty, 201);
    }

    public function destroy($id)
    {
        $specialty = Specialty::findOrFail($id);
        $specialty->delete();

        return response()->json(null, 204);
    }
}