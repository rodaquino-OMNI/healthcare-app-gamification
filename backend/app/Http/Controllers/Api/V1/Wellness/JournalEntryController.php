<?php

namespace App\Http\Controllers\Api\V1\Wellness;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wellness\StoreJournalEntryRequest;
use App\Http\Resources\Wellness\JournalEntryResource;
use App\Models\JournalEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JournalEntryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $entries = JournalEntry::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return JournalEntryResource::collection($entries);
    }

    public function store(StoreJournalEntryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $entry = JournalEntry::create([
            'user_id' => $request->user()->id,
            'mood'    => $validated['mood'],
            'body'    => $validated['body'],
            'tags'    => $validated['tags'] ?? null,
        ]);

        return (new JournalEntryResource($entry))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): JournalEntryResource
    {
        $entry = JournalEntry::findOrFail($id);

        return new JournalEntryResource($entry);
    }

    public function destroy(string $id): JsonResponse
    {
        $entry = JournalEntry::findOrFail($id);
        $entry->delete();

        return response()->json(null, 204);
    }
}
