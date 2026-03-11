<?php

namespace App\Http\Controllers\Api\V1\Plan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Http\Requests\Plan\UpdatePlanRequest;
use App\Http\Resources\Plan\PlanResource;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlanController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $plans = Plan::where('user_id', $request->user()->id)
            ->paginate(15);

        return PlanResource::collection($plans);
    }

    public function store(StorePlanRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $plan = Plan::create([
            'user_id' => $request->user()->id,
            'plan_number' => $validated['name'],
            'type' => $validated['type'],
            'validity_start' => now()->toDateString(),
            'validity_end' => now()->addYear()->toDateString(),
            'coverage_details' => $validated['coverage_details'] ?? null,
        ]);

        return (new PlanResource($plan))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): PlanResource
    {
        $plan = Plan::findOrFail($id);

        return new PlanResource($plan);
    }

    public function update(UpdatePlanRequest $request, string $id): PlanResource
    {
        $plan = Plan::findOrFail($id);
        $plan->update($request->validated());

        return new PlanResource($plan);
    }

    public function destroy(string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);
        $plan->delete();

        return response()->json(null, 204);
    }
}
