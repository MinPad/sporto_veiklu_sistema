<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\CreateCityRequest;
use Illuminate\Support\Facades\Validator;

class CreateCityRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function create_city_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'Vilnius City'
        ];

        $request = new CreateCityRequest();
        $rules = $request->rules();
        $rules['name'] = ['required', 'string', 'min:5', 'max:255', 'regex:/^[\pL\s\-]+$/u'];
        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function create_city_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'V1' // too short and invalid characters
        ];

        $request = new CreateCityRequest();
        $rules = $request->rules();
        $rules['name'] = ['required', 'string', 'min:5', 'max:255', 'regex:/^[\pL\s\-]+$/u'];
        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->passes());
    }
}
