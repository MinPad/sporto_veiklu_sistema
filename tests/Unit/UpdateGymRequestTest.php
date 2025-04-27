<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\UpdateGymRequest;
use Illuminate\Support\Facades\Validator;

class UpdateGymRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_gym_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'Fit Club',
            'address' => '456 Health Blvd.',
            'description' => 'A great gym for all fitness levels!',
            'opening_hours' => '06:00 - 22:00',
            'latitude' => 54.6872,
            'longitude' => 25.2797,
            'image_url' => 'https://example.com/fitness.jpg',
            'is_free' => true,
        ];

        $request = new UpdateGymRequest();
        $validator = Validator::make($data, $request->rules());

        $request->merge($data);
        $request->withValidator($validator);

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function update_gym_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'X', // too short
            'address' => '', // required
            'description' => '12345', // invalid description
            'opening_hours' => 'open till late', // wrong format
            'image_url' => 'invalid-url',
            'latitude' => 100, // invalid
            'longitude' => 200, // invalid
            'is_free' => false,
            'monthly_fee' => null, // should fail custom validation
        ];

        $request = new UpdateGymRequest();
        $validator = Validator::make($data, $request->rules());

        $request->merge($data);
        $request->withValidator($validator);

        $this->assertFalse($validator->passes());
    }
}
