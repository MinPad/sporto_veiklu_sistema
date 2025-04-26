<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateGymRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $cityId = $this->route('city');

        return [
            'name' => [
                'required', 'string', 'min:5', 'max:255',
                'regex:/^[\pL\d\- ]+$/u',
                Rule::unique('gyms')->where(fn($q) =>
                    $q->where('address', $this->address)
                      ->where('city_id', $cityId)
                ),
            ],
            'address' => [
            'required', 'string', 'min:5', 'max:70',
            'regex:/^[\pL\d\s.,#\/\-]+$/u'
            ],
            'description' => ['required', 'string', 'min:10', 'max:150', 'regex:/[a-zA-Z]/'],
            'opening_hours' => ['required', 'string', 'regex:/^\d{2}:\d{2} - \d{2}:\d{2}$/'],
            'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'image_url' => ['nullable', 'url'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages()
    {
        return [
            'name.unique' => 'A gym with this name and address already exists in this city.',
            'name.regex' => 'Only letters, digits, spaces, and dashes are allowed.',
            'address.regex' => 'Only letters, digits, spaces, dots, dashes, commas, slashes, and # are allowed.',
            'image_url.url' => 'The image URL must be a valid URL.',
            'description.regex' => 'The description must contain at least some letters.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Ensure either file or URL is provided
            // if (!$this->hasFile('image') && !$this->filled('image_url')) {
            //     $validator->errors()->add('image', 'Either an image file or a URL is required.');
            // }
            $isFree = $this->boolean('is_free', false);
            $monthlyFee = $this->input('monthly_fee');
        
            if (!$isFree && ($monthlyFee === null || $monthlyFee === '')) {
                $validator->errors()->add('monthly_fee', 'Please specify a monthly fee or mark the gym as free.');
            }
            // If image_url is filled, make sure it's an image
            if ($this->filled('image_url') && 
                !preg_match('/\.(jpg|jpeg|png|gif)(\?.*)?$/i', $this->input('image_url'))) {
                $validator->errors()->add('image_url', 'Image URL must point to a valid image file.');
            }
        });
    }
}
