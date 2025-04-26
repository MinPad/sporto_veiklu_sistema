<?php

namespace App\Http\Controllers;

use App\Models\SportsEvent;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\SportEventResource;
use App\Models\Specialty;
class SportEventController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = SportsEvent::upcoming()->with('specialties');
    
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->whereRaw('LOWER(name) LIKE ?', ["%$search%"]);
        }
    
        if ($request->filled('specialties')) {
            $specialtyNames = $request->specialties;
            $query->whereHas('specialties', function ($q) use ($specialtyNames) {
                $q->whereIn('name', $specialtyNames);
            });
        }
    
        if ($request->filled('difficulty')) {
            $query->where('difficulty_level', $request->difficulty);
        }
    
        if ($request->filled('goals')) {
            $goals = $request->goals;
            $query->where(function($q) use ($goals) {
                foreach ($goals as $goal) {
                    $q->orWhereJsonContains('goal_tags', $goal);
                }
            });
        }
    
        $events = $query->paginate($request->get('per_page', 6));
    
        return SportEventResource::collection($events);
    }
    
    public function filterOptions()
    {
        $specialties = Specialty::pluck('name');
        $goals = SportsEvent::distinct()->pluck('goal_tags')->flatten()->unique()->values()->all();
        $difficulties = SportsEvent::distinct()->pluck('difficulty_level')->unique()->values();
    
        return response()->json([
            'specialties' => $specialties,
            'goals' => $goals,
            'difficulties' => $difficulties,
        ]);
    }
    
    public function join(Request $request, $id)
    {
        try {
            $user = auth()->user();
            $sportsEvent = SportsEvent::with(['users', 'coaches', 'specialties'])->findOrFail($id);

            $sportsEvent->addUser($user);

            return response()->json([
                'message' => 'You have successfully joined the event.',
                'event' => new SportEventResource($sportsEvent),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }
    public function show($id, Request $request)
    {
        try {
            $sportsEvent = SportsEvent::with(['users', 'coaches', 'specialties'])->findOrFail($id);
    
            return response()->json(new SportEventResource($sportsEvent), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Event not found'], 404);
        }
    }
    
    public function leave(Request $request, $id)
    {
        try {
            $user = auth()->user();
            $sportsEvent = SportsEvent::with(['users', 'coaches', 'specialties'])->findOrFail($id);

            $sportsEvent->removeUser($user);

            return response()->json([
                'message' => 'You have successfully left the event.',
                'event' => new SportEventResource($sportsEvent),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }
    
    public function myEvents(Request $request)
    {
        $user = $request->user();
    
        $events = $user->sportsEvents()
            ->with(['coaches', 'specialties'])
            ->wherePivot('left_at', null)
            ->where(function ($query) {
                $query->whereNull('end_date')->whereDate('start_date', '>=', now())
                      ->orWhereNotNull('end_date')->whereDate('end_date', '>=', now());
            })
            ->orderBy('start_date')
            ->paginate(3);
    
        return SportEventResource::collection($events);
    }
    
    public function delete(SportsEvent $sportsEvent)
    {
        $this->authorize('delete', $sportsEvent);

        if (!$sportsEvent->id) {
            return response(['message' => 'Resource not found'], 404);
        }

        $sportsEvent->delete();

        return response('', 204); // No content
    }
}