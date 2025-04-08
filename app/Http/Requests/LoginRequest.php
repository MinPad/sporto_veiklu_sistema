<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'email' => 'required|email|string|unique:users,email',
            'email' => 'required|email|string',
            'password'=> 'required|string',
            'remember' => 'boolean'
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'Email is required.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'login.failed' => 'Incorrect email or password.',
            'server.error' => 'Something went wrong. Please try again later.',
        ];
    }
}
