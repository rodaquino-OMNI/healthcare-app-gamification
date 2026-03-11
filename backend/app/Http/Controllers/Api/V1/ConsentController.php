<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ConsentRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $consents = ConsentRecord::where('user_id', $request->user()->id)
            ->paginate(15);

        return response()->json($consents);
    }

    public function store(Request $request): JsonResponse
    {
        $consent = ConsentRecord::create([
            ...$request->all(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => $consent], 201);
    }

    public function revoke(string $id): JsonResponse
    {
        $consent = ConsentRecord::findOrFail($id);
        $consent->update([
            'status' => 'REVOKED',
            'revoked_at' => now(),
        ]);

        return response()->json(['data' => $consent], 200);
    }
}
