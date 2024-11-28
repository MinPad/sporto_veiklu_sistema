<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; 
class CreateCityRequest extends FormRequest
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
            'name' => [
                'required', 
                'string', 
                'min:5', 
                'max:255', 
                'regex:/^[\pL\d\- ]*$/u', 
                Rule::unique('cities'),
            ],
        ];
    }


    public function messages()
    {
        return [
            'name.unique' => 'A city with this name already exists',
        ];
    }
}