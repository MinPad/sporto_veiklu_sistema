<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\CreateGymRequest;
use Illuminate\Support\Facades\Validator;

class CreateGymRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function create_gym_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'Super Gym',
            'address' => '123 Fitness St.',
            'description' => 'The best gym in the city!',
            'opening_hours' => '08:00 - 22:00',
            'latitude' => 54.6872,
            'longitude' => 25.2797,
            'image_url' => 'https://example.com/gym.jpg',
            'is_free' => true,
        ];

        $request = new CreateGymRequest();
        $rules = $request->rules();
        $rules['name'] = ['required', 'string', 'min:5', 'max:255', 'regex:/^[\pL\d\- ]+$/u'];

        $validator = Validator::make($data, $rules);

        $request->merge($data);
        $request->withValidator($validator);

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function create_gym_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'G', // too short
            'address' => '', // required
            'description' => '1234567890', // only numbers, fails regex
            'opening_hours' => '8AM to 10PM', // wrong format
            'image_url' => 'not-a-valid-url',
            'latitude' => 100, // invalid latitude
            'longitude' => 200, // invalid longitude
            'is_free' => false,
            'monthly_fee' => null, // should trigger custom monthly_fee error
        ];

        $request = new CreateGymRequest();
        $rules = $request->rules();
        $rules['name'] = ['required', 'string', 'min:5', 'max:255', 'regex:/^[\pL\d\- ]+$/u'];

        $validator = Validator::make($data, $rules);

        $request->merge($data);
        $request->withValidator($validator);

        $this->assertFalse($validator->passes());
    }
}