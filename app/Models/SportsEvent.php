<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SportsEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'entry_fee',
        'is_free',
        'start_date',
        'end_date',
        'max_participants',
        'current_participants',
    ];

    protected $with = ['users']; // Eager load users relationship

    public function isFull()
    {
        return $this->max_participants !== null && $this->current_participants >= $this->max_participants;
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'sports_event_user')->withTimestamps();
    }

    public function addUser(User $user)
    {
        if ($this->isFull()) {
            throw new \Exception("This event is already full.");
        }

        if (!$this->users()->where('user_id', $user->id)->exists()) {
            $this->users()->attach($user->id);
            $this->increment('current_participants');
        }
    }

    public function removeUser(User $user)
    {
        if ($this->users()->where('user_id', $user->id)->exists()) {
            $this->users()->detach($user->id);
            $this->decrement('current_participants');
        }
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeNotFull($query)
    {
        return $query->where(function ($q) {
            $q->where('max_participants', '>', $this->current_participants)
              ->orWhereNull('max_participants');
        });
    }
}
