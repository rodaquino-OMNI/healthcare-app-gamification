<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use App\Http\Requests\Health\StoreHealthMetricRequest;
use App\Http\Requests\Health\UpdateHealthMetricRequest;
use App\Http\Resources\Health\HealthMetricResource;
use App\Models\HealthMetric;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HealthMetricController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $metrics = HealthMetric::where('user_id', $request->user()->id)
            ->paginate(15);

        return HealthMetricResource::collection($metrics);
    }

    public function store(StoreHealthMetricRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $metric = HealthMetric::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'value' => $validated['value'],
            'unit' => $validated['unit'],
            'source' => $validated['source'],
            'timestamp' => $validated['recorded_at'] ?? now(),
            'metadata' => $validated['metadata'] ?? null,
        ]);

        return (new HealthMetricResource($metric))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): HealthMetricResource
    {
        $metric = HealthMetric::findOrFail($id);

        return new HealthMetricResource($metric);
    }

    public function update(UpdateHealthMetricRequest $request, string $id): HealthMetricResource
    {
        $metric = HealthMetric::findOrFail($id);
        $metric->update($request->validated());

        return new HealthMetricResource($metric);
    }

    public function destroy(string $id): JsonResponse
    {
        $metric = HealthMetric::findOrFail($id);
        $metric->delete();

        return response()->json(null, 204);
    }
}
