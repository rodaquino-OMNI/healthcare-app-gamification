<?php

namespace App\Http\Controllers\Api\V1\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StoreClaimRequest;
use App\Http\Requests\Plan\UpdateClaimRequest;
use App\Http\Resources\Plan\ClaimResource;
use App\Models\Claim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClaimController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $claims = Claim::where('user_id', $request->user()->id)
            ->paginate(15);

        return ClaimResource::collection($claims);
    }

    public function store(StoreClaimRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $claim = Claim::create([
            'user_id' => $request->user()->id,
            'plan_id' => $validated['plan_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'notes' => $validated['description'] ?? null,
            'submitted_at' => now(),
            'processed_at' => now(),
            'service_date' => $validated['occurred_at'] ?? null,
        ]);

        return (new ClaimResource($claim))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): ClaimResource
    {
        $claim = Claim::findOrFail($id);

        return new ClaimResource($claim);
    }

    public function update(UpdateClaimRequest $request, string $id): ClaimResource
    {
        $claim = Claim::findOrFail($id);
        $claim->update($request->validated());

        return new ClaimResource($claim);
    }

    public function destroy(string $id): JsonResponse
    {
        $claim = Claim::findOrFail($id);
        $claim->delete();

        return response()->json(null, 204);
    }
}
