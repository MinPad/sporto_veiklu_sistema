<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'created_at' => $this->created_at,
            'avatar_url' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'cover_photo_url' => $this->cover_photo ? asset('storage/' . $this->cover_photo) : null,
            'motivational_text' => $this->motivational_text,
        ];
    }
}