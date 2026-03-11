<?php

namespace App\Http\Controllers\Api\V1\Care;

use App\Http\Controllers\Controller;
use App\Http\Resources\Care\ProviderResource;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProviderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $providers = Provider::paginate(15);

        return ProviderResource::collection($providers);
    }

    public function show(string $id): ProviderResource
    {
        $provider = Provider::findOrFail($id);

        return new ProviderResource($provider);
    }
}
