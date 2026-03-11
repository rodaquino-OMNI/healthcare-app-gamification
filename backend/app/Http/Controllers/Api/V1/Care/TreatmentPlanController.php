<?php

namespace App\Http\Controllers\Api\V1\Care;

use App\Http\Controllers\Controller;
use App\Http\Requests\Care\StoreTreatmentPlanRequest;
use App\Http\Requests\Care\UpdateTreatmentPlanRequest;
use App\Http\Resources\Care\TreatmentPlanResource;
use App\Models\TreatmentPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TreatmentPlanController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $plans = TreatmentPlan::where('user_id', $request->user()->id)
            ->paginate(15);

        return TreatmentPlanResource::collection($plans);
    }

    public function store(StoreTreatmentPlanRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $plan = TreatmentPlan::create([
            'user_id' => $request->user()->id,
            'name' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['starts_at'],
            'end_date' => $validated['ends_at'] ?? null,
        ]);

        return (new TreatmentPlanResource($plan))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): TreatmentPlanResource
    {
        $plan = TreatmentPlan::findOrFail($id);

        return new TreatmentPlanResource($plan);
    }

    public function update(UpdateTreatmentPlanRequest $request, string $id): TreatmentPlanResource
    {
        $plan = TreatmentPlan::findOrFail($id);
        $plan->update($request->validated());

        return new TreatmentPlanResource($plan);
    }

    public function destroy(string $id): JsonResponse
    {
        $plan = TreatmentPlan::findOrFail($id);
        $plan->delete();

        return response()->json(null, 204);
    }
}
