<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\UpdateCoachRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;

class UpdateCoachRequestTest extends TestCase
{
    #[Test]
    public function update_coach_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'Jane',
            'surname' => 'Smith',
            'specialties' => [1, 2],
            'gym_id' => 1,
        ];

        $request = new UpdateCoachRequest();
        $rules = $request->rules();
        $rules['gym_id'] = ['nullable', 'integer']; 
        $rules['specialties.*'] = ['integer']; 

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function update_coach_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'J', // too short
            'surname' => 'S#@!', // invalid characters
            'specialties' => 'not-an-array', // wrong type
            'gym_id' => 'not-an-id', // invalid type
        ];

        $request = new UpdateCoachRequest();
        $rules = $request->rules();
        $rules['gym_id'] = ['nullable', 'integer']; 
        $rules['specialties.*'] = ['integer']; 

        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->passes());
    }
}
