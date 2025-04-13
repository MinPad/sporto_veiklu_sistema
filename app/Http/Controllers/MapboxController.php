<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MapboxController extends Controller
{
    public function getDistance(Request $request)
    {
        $origin = $request->query('origin');     
        $destination = $request->query('destination'); 

        if (!$origin || !$destination) {
            return response()->json(['error' => 'Missing origin or destination'], 400);
        }

        $accessToken = env('MAPBOX_TOKEN');
        $url = "https://api.mapbox.com/directions/v5/mapbox/driving/{$origin};{$destination}";

        $response = Http::get($url, [
            'access_token' => $accessToken,
            'overview' => 'false',
            'geometries' => 'geojson',
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Mapbox request failed'], 500);
        }

        $route = $response->json()['routes'][0] ?? null;

        if (!$route) {
            return response()->json(['error' => 'No route found'], 404);
        }

        return response()->json([
            'distance_km' => round($route['distance'] / 1000, 1),
            'duration_min' => round($route['duration'] / 60),
        ]);
    }
}

