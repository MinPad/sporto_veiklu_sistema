<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use App\Http\Resources\SpecialtyResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class SpecialtyController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        return response()->json(SpecialtyResource::collection(Specialty::all()), 200);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Specialty::class);

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
        $this->authorize('create', Specialty::class);
        $specialty = Specialty::findOrFail($id);
        $specialty->delete();

        return response()->json(null, 204);
    }
}