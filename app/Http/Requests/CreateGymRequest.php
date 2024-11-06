<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; 
class CreateGymRequest extends FormRequest
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
        // \Log::info('City ID:', ['city_id' => $this->route('city')]);
        $cityId = $this->route('city');

        return [
            'name' => [
                'required', 
                'string', 
                'min:5', 
                'max:255', 
                'regex:/^[\pL\d\- ]*$/u', 
                Rule::unique('gyms')->where(function ($query) use ($cityId) {
                    $query->where('address', $this->address)
                        ->where('city_id', $cityId); // Use $cityId directly
                    // \Log::info('Checking for existing gym with address and city_id:', [
                    //     'address' => $this->address,
                    //     'city_id' => $this->route('city')->id,
                    // ]);
                }),
            ],
            'address' => [
                'required', 
                'string', 
                'min:5', 
                'max:255', 
                'regex:/^[\pL\d\.\- ]*$/u'
            ],
            'description' => [
                'required', 
                'string', 
                'min:50', 
                'max:1000'
            ],
            'opening_hours' => [
                'required', 
                'string', 
                'regex:/^\d{2}:\d{2} - \d{2}:\d{2}$/'
            ],
        ];
    }


    public function messages()
    {
        return [
            'name.unique' => 'A gym with this name and address already exists in this city.',
            'name.regex' => 'Detected not allowed symbols in the name field.',
            'address.regex' => 'Detected not allowed symbols in the address field.',
        ];
    }
}