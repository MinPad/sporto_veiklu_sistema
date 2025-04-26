<?php

namespace App\Services;

use App\Models\SportsEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use App\Services\UserEventHistoryService;

class RecommendationService
{
    protected UserEventHistoryService $historyService;

    public function __construct(UserEventHistoryService $historyService)
    {
        $this->historyService = $historyService;
        
    }

    public function getRecommendationsQueryForUser(User $user): Builder
    {
        return SportsEvent::where('start_date', '>', now())
            ->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->whereNull('sports_event_user.left_at');
            });
    }
    public function scoreEventsForUser($events, User $user)
    {
        $history = $this->historyService->getRecentParticipationInsights($user);
    
        return $events->map(function ($event) use ($user, $history) {
            $score = 0;
    
            if (!empty($event->goal_tags) && is_array($event->goal_tags) && !empty($user->goal)) {
                $goalMatch = array_intersect($event->goal_tags, $user->goal);
                $score += count($goalMatch) * 3;
            }
    
            if (!empty($event->activity_type) && !empty($user->preferred_workout_types)) {
                if (in_array($event->activity_type, $user->preferred_workout_types)) {
                    $score += 2;
                }
            }
    
            if ($event->difficulty_level && $user->experience_level) {
                if ($event->difficulty_level === $user->experience_level) {
                    $score += 1;
                } else {
                    $score -= 1; 
                }
            }
    
            if (!empty($event->activity_type) && isset($history['activity_types'][$event->activity_type])) {
                $score += $history['activity_types'][$event->activity_type] * 2;
            }
    
            $gymScore = $history['gym_frequency']->get((int) $event->gym_id);
            if ($gymScore) {
                $score += 1; 
                $score += $gymScore * 1.5;
            }
    
            if (!empty($event->goal_tags)) {
                $historyGoals = $history['goal_tags']->keys()->all();
                $goalMatchFromHistory = array_intersect($event->goal_tags, $historyGoals);
                $score += count($goalMatchFromHistory) * 1;
            }
    
            $event->recommendation_score = $score;
    
            // \Log::info("[RECOMMENDATION DEBUG] Event: {$event->name}", [
            //     'event_id' => $event->id,
            //     'user_id' => $user->id,
            //     'recommendation_score' => $score,
            //     'is_user_joined' => $event->users->contains($user->id),
            //     'event_goal_tags' => $event->goal_tags,
            //     'user_goals' => $user->goal,
            //     'gym_id' => $event->gym_id,
            //     'history_gym_freq' => $gymScore ?? null,
            // ]);
    
            return $event;
        });
    }
}