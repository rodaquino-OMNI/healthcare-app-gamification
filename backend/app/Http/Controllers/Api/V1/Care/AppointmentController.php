<?php

namespace App\Http\Controllers\Api\V1\Care;

use App\Http\Controllers\Controller;
use App\Http\Requests\Care\StoreAppointmentRequest;
use App\Http\Requests\Care\UpdateAppointmentRequest;
use App\Http\Resources\Care\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AppointmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $appointments = Appointment::where('user_id', $request->user()->id)
            ->paginate(15);

        return AppointmentResource::collection($appointments);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $appointment = Appointment::create([
            'user_id' => $request->user()->id,
            'provider_id' => $validated['provider_id'],
            'type' => $validated['type'],
            'date_time' => $validated['scheduled_at'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return (new AppointmentResource($appointment))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): AppointmentResource
    {
        $appointment = Appointment::findOrFail($id);

        return new AppointmentResource($appointment);
    }

    public function update(UpdateAppointmentRequest $request, string $id): AppointmentResource
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update($request->validated());

        return new AppointmentResource($appointment);
    }

    public function destroy(string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(null, 204);
    }
}
