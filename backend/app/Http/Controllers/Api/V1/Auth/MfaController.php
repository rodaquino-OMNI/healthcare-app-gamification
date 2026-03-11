<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MfaController extends Controller
{
    public function enable(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'MFA enable is not yet implemented.',
            'mfa_enabled' => false,
        ], 501);
    }

    public function verify(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'MFA verify is not yet implemented.',
            'verified' => false,
        ], 501);
    }

    public function disable(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'MFA disable is not yet implemented.',
            'mfa_enabled' => true,
        ], 501);
    }
}
