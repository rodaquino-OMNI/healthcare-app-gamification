<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use App\Http\Requests\Health\StoreDeviceConnectionRequest;
use App\Http\Requests\Health\UpdateDeviceConnectionRequest;
use App\Http\Resources\Health\DeviceConnectionResource;
use App\Models\DeviceConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DeviceConnectionController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $connections = DeviceConnection::where('user_id', $request->user()->id)
            ->paginate(15);

        return DeviceConnectionResource::collection($connections);
    }

    public function store(StoreDeviceConnectionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $connection = DeviceConnection::create([
            'user_id' => $request->user()->id,
            'record_id' => $validated['device_identifier'],
            'device_type' => $validated['device_type'],
            'device_id' => $validated['device_identifier'],
            'auth_token' => $validated['access_token'] ?? null,
            'refresh_token' => $validated['refresh_token'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
        ]);

        return (new DeviceConnectionResource($connection))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): DeviceConnectionResource
    {
        $connection = DeviceConnection::findOrFail($id);

        return new DeviceConnectionResource($connection);
    }

    public function update(UpdateDeviceConnectionRequest $request, string $id): DeviceConnectionResource
    {
        $connection = DeviceConnection::findOrFail($id);
        $validated = $request->validated();

        $mapped = [];
        if (isset($validated['status'])) {
            $mapped['status'] = $validated['status'];
        }
        if (isset($validated['access_token'])) {
            $mapped['auth_token'] = $validated['access_token'];
        }
        if (isset($validated['refresh_token'])) {
            $mapped['refresh_token'] = $validated['refresh_token'];
        }
        if (isset($validated['metadata'])) {
            $mapped['metadata'] = $validated['metadata'];
        }

        $connection->update($mapped);

        return new DeviceConnectionResource($connection);
    }

    public function destroy(string $id): JsonResponse
    {
        $connection = DeviceConnection::findOrFail($id);
        $connection->delete();

        return response()->json(null, 204);
    }
}
