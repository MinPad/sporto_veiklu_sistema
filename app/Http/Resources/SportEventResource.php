<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SportEventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'entry_fee' => $this->entry_fee,
            'is_free' => $this->is_free,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'max_participants' => $this->max_participants,
            'current_participants' => $this->current_participants,
            'is_full' => $this->isFull(),
            'participants_count' => $this->users()->count(),
            'gym_id' => $this->gym_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'goal_tags' => $this->goal_tags,
            'difficulty_level' => $this->difficulty_level,

            'is_joined' => $request->user()
            ? $this->users()
            ->where('user_id', $request->user()->id)
            ->wherePivot('left_at', null)
            ->exists()
            : false,

            'recommendation_score' => $this->recommendation_score,

            'participants' => UserResource::collection(
                $this->whenLoaded('users')
            ),

            'specialties' => $this->specialties->map(function ($specialty) {
                return [
                    'id' => $specialty->id,
                    'name' => $specialty->name,
                ];
            }),

            'coaches' => $this->coaches->map(function ($coach) {
            return [
            'id' => $coach->id,
            'name' => $coach->name,
            'surname' => $coach->surname,
            'gym_id' => $coach->gym_id,
            'specialties' => $coach->specialties->map(function ($spec) {
            return [
                'id' => $spec->id,
                'name' => $spec->name,
            ];
            }),
            ];
        }),
        ];
    }
}
