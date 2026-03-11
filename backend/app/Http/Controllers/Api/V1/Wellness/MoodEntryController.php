<?php

namespace App\Http\Controllers\Api\V1\Wellness;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wellness\StoreMoodEntryRequest;
use App\Http\Resources\Wellness\MoodEntryResource;
use App\Models\MoodEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MoodEntryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $entries = MoodEntry::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return MoodEntryResource::collection($entries);
    }

    public function store(StoreMoodEntryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $entry = MoodEntry::create([
            'user_id' => $request->user()->id,
            'mood'    => $validated['mood'],
            'note'    => $validated['note'] ?? null,
        ]);

        return (new MoodEntryResource($entry))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(string $id): JsonResponse
    {
        $entry = MoodEntry::findOrFail($id);
        $entry->delete();

        return response()->json(null, 204);
    }
}
