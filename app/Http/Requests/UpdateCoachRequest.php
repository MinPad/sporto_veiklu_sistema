<?php

namespace App\Http\Requests;

use App\Models\Gym;
use App\Rules\ExistingCity;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCoachRequest extends FormRequest
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
            'name' => ['nullable', 'string' ,'min:2', 'max:255', 'regex:/^[\pL\d\- ]*$/u'],
            'surname' => ['nullable', 'string' ,'min:2', 'max:255', 'regex:/^[\pL\d\.\- ]*$/u'],
            'specialty' => ['nullable', 'string' ,'min:2', 'max:255', 'regex:/^[\pL\d\.\- ]*$/u']
        ];
    }

    public function messages()
    {
        return [
            'name.regex' => 'Detected not allowed symbols in the name field',
            'surname.regex' => 'Detected not allowed symbols in the surname field',
            'specialty.regex' => 'Detected not allowed symbols in the surname field'
        ];
    }
}