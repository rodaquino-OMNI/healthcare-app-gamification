<?php

namespace App\Http\Controllers\Api\V1\Plan;

use App\Http\Controllers\Controller;
use App\Http\Resources\Plan\CoverageResource;
use App\Models\Coverage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CoverageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $coverages = Coverage::paginate(15);

        return CoverageResource::collection($coverages);
    }

    public function show(string $id): CoverageResource
    {
        $coverage = Coverage::findOrFail($id);

        return new CoverageResource($coverage);
    }
}
