<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\CreateCoachRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test; 

class CreateCoachRequestTest extends TestCase
{
    #[Test]
    public function create_coach_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'John',
            'surname' => 'Doe',
            'specialties' => [1, 2],
            'is_approved' => true,
            'gym_id' => 1,
        ];

        $request = new CreateCoachRequest();
        $rules = $request->rules();
        $rules['gym_id'] = ['nullable', 'integer']; 
        $rules['specialties.*'] = ['integer']; 

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function create_coach_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'J',
            'surname' => 'D@3',
            'specialties' => 'not-an-array',
            'is_approved' => 'not-a-boolean',
            'gym_id' => 'not-an-id',
        ];

        $request = new CreateCoachRequest();
        $rules = $request->rules();
        $rules['gym_id'] = ['nullable', 'integer']; 
        $rules['specialties.*'] = ['integer']; 

        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->passes());
    }
}
