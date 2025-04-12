<?php

namespace App\Http\Requests;

use App\Models\Gym;
use App\Rules\ExistingCity;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGymRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string' ,'min:5', 'max:255', 'regex:/^[\pL\d\- ]*$/u'],
            'address' => ['required', 'string' ,'min:5', 'max:50', 'regex:/^[\pL\d\.\- ]*$/u'],
            'description' => ['required', 'string' ,'min:10', 'max:150'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages()
    {
        return [
            'name.regex' => 'Detected not allowed symbols in the name field',
            'address.regex' => 'Detected not allowed symbols in the address field'
        ];
    }
}