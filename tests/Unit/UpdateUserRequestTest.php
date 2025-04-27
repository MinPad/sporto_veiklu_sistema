<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Validator;

class UpdateUserRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function update_user_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'John',
            'surname' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!'
        ];

        $request = new UpdateUserRequest();
        $rules = $request->rules();
        $rules['email'] = 'sometimes|required|string|email|max:255';
        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function update_user_request_fails_with_invalid_data()
    {
        $data = [
            'name' => 'J', // too short
            'surname' => 'D3', // invalid characters
            'email' => 'not-an-email',
            'password' => 'short', // too weak
            'password_confirmation' => 'doesnotmatch'
        ];

        $request = new UpdateUserRequest();
        $rules = $request->rules();
        $rules['email'] = 'sometimes|required|string|email|max:255';
        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->passes());
    }
}
