<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use App\Http\Requests\Health\StoreMedicalEventRequest;
use App\Http\Requests\Health\UpdateMedicalEventRequest;
use App\Http\Resources\Health\MedicalEventResource;
use App\Models\MedicalEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MedicalEventController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $events = MedicalEvent::where('user_id', $request->user()->id)
            ->paginate(15);

        return MedicalEventResource::collection($events);
    }

    public function store(StoreMedicalEventRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $event = MedicalEvent::create([
            'user_id' => $request->user()->id,
            'type' => $validated['event_type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'date' => $validated['occurred_at'],
        ]);

        return (new MedicalEventResource($event))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): MedicalEventResource
    {
        $event = MedicalEvent::findOrFail($id);

        return new MedicalEventResource($event);
    }

    public function update(UpdateMedicalEventRequest $request, string $id): MedicalEventResource
    {
        $event = MedicalEvent::findOrFail($id);
        $event->update($request->validated());

        return new MedicalEventResource($event);
    }

    public function destroy(string $id): JsonResponse
    {
        $event = MedicalEvent::findOrFail($id);
        $event->delete();

        return response()->json(null, 204);
    }
}
