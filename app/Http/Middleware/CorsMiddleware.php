<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// class CorsMiddleware
// {
//         public function handle($request, Closure $next)
//     {
//     if ($request->isMethod('options')) {
//         return response()->json([], 200)
//             // ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
//             ->header('Access-Control-Allow-Origin', '*')
//             ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//             ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     }

//     return $next($request)
//         ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
//         ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//         ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     }
// }

class CorsMiddleware{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization');

        return $response;
    }
}
