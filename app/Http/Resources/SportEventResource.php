<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SportEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
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
            'is_full' => $this->isFull(), // If you want to include a computed property (like whether the event is full)
            'participants_count' => $this->users()->count(), // Optional: Count the number of participants (if needed)
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Optionally, include user data who joined the event, if needed
            'participants' => UserResource::collection(resource: $this->whenLoaded('users')), // If you want to include participants data, and you eager load 'users'
        ];
    }
}
