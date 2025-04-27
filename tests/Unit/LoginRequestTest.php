<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Validator;

class LoginRequestTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function login_request_passes_with_valid_data()
    {
        $data = [
            'email' => 'johndoe@example.com',
            'password' => 'Password123!',
            'remember' => true
        ];

        $request = new LoginRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertTrue($validator->passes());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function login_request_fails_with_invalid_data()
    {
        $data = [
            'email' => 'not-an-email',
            'password' => '', // missing password
            'remember' => 'notaboolean'
        ];

        $request = new LoginRequest();
        $validator = Validator::make($data, $request->rules());

        $this->assertFalse($validator->passes());
    }
}