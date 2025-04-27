<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\UpdateUserPersonalizationRequest;
use Illuminate\Support\Facades\Validator;

class UpdateUserPersonalizationRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_user_personalization_request_passes_with_valid_data()
    {
        $data = [
            'motivational_text' => 'Stay strong!',
            'height' => 180,
            'weight' => 75,
            'experience_level' => 'Intermediate',
            'goal' => ['Lose Weight', 'Gain Muscle'],
            'preferred_workout_types' => ['Cardio', 'Strength']
        ];

        $request = new UpdateUserPersonalizationRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function update_user_personalization_request_fails_with_invalid_data()
    {
        $data = [
            'motivational_text' => str_repeat('A', 600), // too long
            'height' => 400, // too high
            'weight' => 5, // too low
            'experience_level' => 'Expert', // not in allowed values
            'goal' => ['This goal name is way toooooooooooooooooooooooo long and invalid'],
            'preferred_workout_types' => ['Type with very very very very long name exceeding limits']
        ];

        $request = new UpdateUserPersonalizationRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
    }
}
