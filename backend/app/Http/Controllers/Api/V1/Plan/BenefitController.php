<?php

namespace App\Http\Controllers\Api\V1\Plan;

use App\Http\Controllers\Controller;
use App\Http\Resources\Plan\BenefitResource;
use App\Models\Benefit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BenefitController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $benefits = Benefit::paginate(15);

        return BenefitResource::collection($benefits);
    }

    public function show(string $id): BenefitResource
    {
        $benefit = Benefit::findOrFail($id);

        return new BenefitResource($benefit);
    }
}
