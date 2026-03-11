<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use App\Http\Requests\Health\StoreHealthGoalRequest;
use App\Http\Requests\Health\UpdateHealthGoalRequest;
use App\Http\Resources\Health\HealthGoalResource;
use App\Models\HealthGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HealthGoalController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $goals = HealthGoal::where('record_id', $request->user()->id)
            ->paginate(15);

        return HealthGoalResource::collection($goals);
    }

    public function store(StoreHealthGoalRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $goal = HealthGoal::create([
            'record_id' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'target_value' => $validated['target_value'],
            'unit' => $validated['unit'],
            'period' => $validated['period'],
            'start_date' => $validated['starts_at'],
            'end_date' => $validated['ends_at'] ?? null,
        ]);

        return (new HealthGoalResource($goal))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): HealthGoalResource
    {
        $goal = HealthGoal::findOrFail($id);

        return new HealthGoalResource($goal);
    }

    public function update(UpdateHealthGoalRequest $request, string $id): HealthGoalResource
    {
        $goal = HealthGoal::findOrFail($id);
        $goal->update($request->validated());

        return new HealthGoalResource($goal);
    }

    public function destroy(string $id): JsonResponse
    {
        $goal = HealthGoal::findOrFail($id);
        $goal->delete();

        return response()->json(null, 204);
    }
}
