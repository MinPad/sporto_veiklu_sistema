<?php

namespace App\Models;

use App\Models\User;
use App\Models\Gym;
use App\Models\SportsEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coach extends Model
{
    use HasFactory;

    // public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
        'id',
        'name',
        'surname',
        // 'specialty',
        'is_approved',
        'gym_id'
    ];

    protected $attributes = [
        'is_approved' => 0
    ];

    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'coach_specialty')->withTimestamps();
    }
    public function gym()
    {
        return $this->belongsTo(Gym::class, 'gym_id')->withDefault();
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class, 'coach_id');
    }
    public function sportsEvents()
    {
        return $this->belongsToMany(SportsEvent::class, 'coach_sports_event')->withTimestamps();
    }
    
}
