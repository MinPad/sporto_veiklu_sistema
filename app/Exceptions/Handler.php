<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    protected $levels = [
        // Custom log levels for exceptions, if needed
    ];

    protected $dontReport = [
        // Exceptions that should not be reported
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function render($request, Throwable $exception)  // Change Exception to Throwable
    {
        Log::error('Exception caught: ' . $exception->getMessage());
        
        if ($exception instanceof TokenExpiredException) {
            return response()->json(['error' => 'Token expired.'], 401);
        }

        return parent::render($request, $exception);
    }

    protected function invalidJson($request, \Illuminate\Validation\ValidationException $exception)
    {
        return response()->json([
            'message' => 'Validation Error',
            'errors' => $exception->validator->errors(),
        ], 422);
    }

    protected function invalidJsonStructure(Request $request, \Symfony\Component\HttpKernel\Exception\BadRequestHttpException $exception): JsonResponse
    {
        return response()->json([
            'message' => 'Malformed JSON',
            'error' => $exception->getMessage(),
        ], 400);
    }

    public function register()
    {
        $this->renderable(function (MethodNotAllowedHttpException $e, $request) {
            return response()->json([
                'message' => 'Method not allowed for this route.',
            ], 405);
        });
        // Custom handling for ModelNotFoundException
        $this->renderable(function (ModelNotFoundException $e, $request) {
            return response()->json(['message' => 'A user with this id doesn\'t exist'], 404);
        });

        $this->renderable(function (HttpException $e, $request) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getStatusCode());
        });

        // General error handling
        $this->renderable(function (\Throwable $e, $request) {
            Log::error('Unexpected error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred.',
            ], 500);
        });
    }
}