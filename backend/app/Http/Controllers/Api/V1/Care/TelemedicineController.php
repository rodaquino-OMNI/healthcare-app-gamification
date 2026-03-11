<?php

namespace App\Http\Controllers\Api\V1\Care;

use App\Http\Controllers\Controller;
use App\Http\Requests\Care\StoreTelemedicineRequest;
use App\Http\Requests\Care\UpdateTelemedicineRequest;
use App\Http\Resources\Care\TelemedicineResource;
use App\Models\TelemedicineSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TelemedicineController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $sessions = TelemedicineSession::where('patient_id', $request->user()->id)
            ->paginate(15);

        return TelemedicineResource::collection($sessions);
    }

    public function store(StoreTelemedicineRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $session = TelemedicineSession::create([
            'patient_id' => $request->user()->id,
            'provider_id' => $request->user()->id,
            'appointment_id' => $validated['appointment_id'] ?? null,
            'start_time' => $validated['scheduled_at'],
            'status' => 'scheduled',
        ]);

        return (new TelemedicineResource($session))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): TelemedicineResource
    {
        $session = TelemedicineSession::findOrFail($id);

        return new TelemedicineResource($session);
    }

    public function update(UpdateTelemedicineRequest $request, string $id): TelemedicineResource
    {
        $session = TelemedicineSession::findOrFail($id);
        $session->update($request->validated());

        return new TelemedicineResource($session);
    }

    public function destroy(string $id): JsonResponse
    {
        $session = TelemedicineSession::findOrFail($id);
        $session->delete();

        return response()->json(null, 204);
    }
}
