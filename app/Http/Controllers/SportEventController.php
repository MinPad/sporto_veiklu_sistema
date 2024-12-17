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
        // Paginate the results (10 events per page, adjust as needed)
        $events = SportsEvent::with('users')->paginate(10);
        return response()->json(SportEventResource::collection($events), 200);
    }
    public function join(Request $request, $id)
    {
    // \Log::info('Joining event:', ['id' => $id, 'user' => auth()->id()]);

    try {
        $user = auth()->user();
        $sportsEvent = SportsEvent::findOrFail($id);

        $sportsEvent->addUser($user);

        return response()->json([
            'message' => 'You have successfully joined the event.',
            'event' => new SportEventResource($sportsEvent),
        ], 200);
    } catch (\Exception $e) {
        // \Log::error('Error joining event:', ['message' => $e->getMessage()]);
        return response()->json([
            'message' => $e->getMessage(),
        ], 400);
    }
    }
    public function leave(Request $request, $id)
    {
        try {
            $user = auth()->user();
            $sportsEvent = SportsEvent::findOrFail($id);

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

    
    // public function delete(SportEvent $city)
    // {
    //     $this->authorize('delete', $city); 
    //     if (!$city->id) {
    //         return response(['message' => 'Resource not found'], 404);
    //     }
    //     $city->delete();
    //     return response('', 204);
    // }
    
    
}
