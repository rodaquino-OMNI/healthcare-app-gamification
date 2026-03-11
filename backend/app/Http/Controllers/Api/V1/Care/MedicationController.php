<?php

namespace App\Http\Controllers\Api\V1\Care;

use App\Http\Controllers\Controller;
use App\Http\Requests\Care\StoreMedicationRequest;
use App\Http\Requests\Care\UpdateMedicationRequest;
use App\Http\Resources\Care\MedicationResource;
use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MedicationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $medications = Medication::where('user_id', $request->user()->id)
            ->paginate(15);

        return MedicationResource::collection($medications);
    }

    public function store(StoreMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $medication = Medication::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'dosage' => $validated['dosage'],
            'frequency' => $validated['frequency'],
            'start_date' => $validated['starts_at'],
            'end_date' => $validated['ends_at'] ?? null,
            'notes' => $validated['instructions'] ?? null,
            'reminder_enabled' => false,
            'active' => true,
        ]);

        return (new MedicationResource($medication))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): MedicationResource
    {
        $medication = Medication::findOrFail($id);

        return new MedicationResource($medication);
    }

    public function update(UpdateMedicationRequest $request, string $id): MedicationResource
    {
        $medication = Medication::findOrFail($id);
        $medication->update($request->validated());

        return new MedicationResource($medication);
    }

    public function destroy(string $id): JsonResponse
    {
        $medication = Medication::findOrFail($id);
        $medication->delete();

        return response()->json(null, 204);
    }
}
