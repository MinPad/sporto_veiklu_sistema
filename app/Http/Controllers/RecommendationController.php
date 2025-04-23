<?php

namespace App\Http\Controllers;

use App\Http\Resources\SportEventResource;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }
    public function index(Request $request)
    {
        $user = $request->user();
    
        $allEvents = $this->recommendationService
                          ->getRecommendationsQueryForUser($user)
                          ->with(['coaches', 'specialties']) // eager load if needed
                          ->get(); // ⛔ no pagination here!
    
        $scored = $this->recommendationService
                       ->scoreEventsForUser($allEvents, $user);
    
        $sorted = $scored->sortByDesc('recommendation_score')->values();
    
        $perPage = 3;
        $page = $request->input('page', 1);
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $sorted->forPage($page, $perPage),
            $sorted->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );
    
        return SportEventResource::collection($paginated);
    }
    
    
    
}