<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gym_id',
        'rating',
        'comment',
    ];

    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
