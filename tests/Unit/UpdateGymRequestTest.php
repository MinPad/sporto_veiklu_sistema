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
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_gym_fails_without_monthly_fee_when_not_free()
    {
        $data = [
            'name' => 'Power Gym',
            'address' => 'Street 9',
            'description' => 'Real strong gym',
            'opening_hours' => '08:00 - 22:00',
            'is_free' => false,
            'monthly_fee' => '', // edge case
        ];
    
        $request = new UpdateGymRequest();
        $validator = Validator::make($data, $request->rules());
    
        $request->merge($data);
        $request->withValidator($validator);
    
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('monthly_fee', $validator->errors()->toArray());
    }
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_gym_fails_if_image_url_not_image_file()
    {
        $data = [
            'name' => 'Valid Name',
            'address' => 'Some Address',
            'description' => 'Some description here.',
            'opening_hours' => '10:00 - 20:00',
            'is_free' => true,
            'image_url' => 'https://example.com/file.docx', // invalid ext
        ];
    
        $request = new UpdateGymRequest();
        $validator = Validator::make($data, $request->rules());
    
        $request->merge($data);
        $request->withValidator($validator);
    
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('image_url', $validator->errors()->toArray());
    }
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_gym_passes_when_paid_with_fee()
    {
        $data = [
            'name' => 'Paid Gym',
            'address' => 'Rich Street 1',
            'description' => 'Luxurious fitness.',
            'opening_hours' => '09:00 - 21:00',
            'is_free' => false,
            'monthly_fee' => 99.99,
        ];
    
        $request = new UpdateGymRequest();
        $validator = Validator::make($data, $request->rules());
    
        $request->merge($data);
        $request->withValidator($validator);
    
        $this->assertTrue($validator->passes());
    }
    
    
}
