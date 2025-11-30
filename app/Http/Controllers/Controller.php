<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Standard JSON API response helper.
     *
     * @param  mixed       $data
     * @param  string|null $message
     * @param  int         $status
     * @param  bool        $success
     * @return \Illuminate\Http\JsonResponse
     */
    protected function apiResponse(
        $data = null,
        ?string $message = null,
        int $status = 200,
        bool $success = true,
    ): JsonResponse {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }
}
