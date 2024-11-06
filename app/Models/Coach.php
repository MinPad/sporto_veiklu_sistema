<?php

namespace App\Models;

use App\Models\User;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coach extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'surname',
        'specialty',
        'is_approved',
        'gym_id'
    ];

    protected $attributes = [
        'is_approved' => 0
    ];


    public function gym()
    {
    return $this->belongsTo(Gym::class, 'gym_id');
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class, 'coach_id');
    }

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}