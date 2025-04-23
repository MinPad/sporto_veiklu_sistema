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
        'gym_id',
        'activity_type',
        'difficulty_level',
        'goal_tags',
    ];

    protected $with = ['users']; // Eager load users relationship
    protected $casts = [
        'goal_tags' => 'array',
    ]; 
    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'event_specialty')->withTimestamps();
    }
    public function isFull()
    {
        return $this->max_participants !== null && $this->current_participants >= $this->max_participants;
    }

    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }
    public function coaches()
    {
        return $this->belongsToMany(Coach::class, 'coach_sports_event')->withTimestamps();
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

        if ($this->users()->where('user_id', $user->id)->exists()) {
            $this->users()->updateExistingPivot($user->id, ['left_at' => null]);
        } else {
            $this->users()->attach($user->id, ['left_at' => null]);
            $this->increment('current_participants');
        }
    }

    public function removeUser(User $user)
    {
        if ($this->users()->where('user_id', $user->id)->exists()) {
            $this->users()->updateExistingPivot($user->id, ['left_at' => now()]);
            $this->decrement('current_participants');
        }
    }

    public function scopeUpcoming($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('end_date')->whereDate('start_date', '>=', now())
            ->orWhereNotNull('end_date')->whereDate('end_date', '>=', now());
        });
    }

    public function scopeNotFull($query)
    {
        return $query->where(function ($q) {
            $q->where('max_participants', '>', $this->current_participants)
              ->orWhereNull('max_participants');
        });
    }
    public function scopePast($query)
    {
        return $query->where(function ($q) {
            $q->whereNotNull('end_date')->whereDate('end_date', '<', now())
              ->orWhere(function ($sub) {
                  $sub->whereNull('end_date')->whereDate('start_date', '<', now());
              });
        });
    }
}
