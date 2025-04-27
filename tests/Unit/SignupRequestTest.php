<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Validator;

class SignupRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function signup_request_passes_with_valid_data()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => 'Password123!', 
            'password_confirmation' => 'Password123!'
        ];

        $request = new SignupRequest();
        $rules = $request->rules();
        $rules['email'] = 'required|email|string';
        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function signup_request_fails_with_invalid_data()
    {
        $data = [
            'name' => '', 
            'email' => 'not-an-email',
            'password' => 'short', 
            'password_confirmation' => 'doesnotmatch'
        ];

        $request = new SignupRequest();
        $rules = $request->rules();
        $rules['email'] = 'required|email|string'; 
        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->passes());
    }
}
