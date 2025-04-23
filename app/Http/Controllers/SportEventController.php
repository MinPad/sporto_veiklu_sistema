<?php

namespace App\Http\Controllers;

use App\Models\SportsEvent;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\SportEventResource;

class SportEventController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $events = SportsEvent::upcoming()->paginate(6);
        return SportEventResource::collection($events);
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
            ->orderByDesc('start_date')
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