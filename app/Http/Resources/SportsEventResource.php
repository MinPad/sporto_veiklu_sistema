<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SportsEventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'entry_fee' => $this->entry_fee,
            'is_free' => $this->is_free,
            'max_participants' => $this->max_participants,
            'current_participants' => $this->current_participants,
            'difficulty_level' => $this->difficulty_level,
            'goal_tags' => $this->goal_tags,

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
                    'specialty' => $coach->specialty,
                    'gym_id' => $coach->gym_id,
                ];
            }),
        ];
    }
}
