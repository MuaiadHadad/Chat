<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Events\UserStatusChanged;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $groups = $request->user()->groups()->with(['users', 'messages' => function($query) {
            $query->latest()->limit(1);
        }])->get();

        return response()->json($groups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $group = Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        // Add creator to group
        $group->users()->attach($request->user()->id);

        // Add other users if provided
        if ($request->has('user_ids')) {
            $group->users()->attach($request->user_ids);
        }

        return response()->json($group->load('users'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $group = Group::with(['users', 'messages.user'])->findOrFail($id);
        return response()->json($group);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $group = Group::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group->update($request->only(['name', 'description']));

        return response()->json($group);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return response()->json(['message' => 'Group deleted successfully']);
    }

    public function addUser(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $group = Group::findOrFail($id);
        $group->users()->syncWithoutDetaching([$request->user_id]);

        return response()->json(['message' => 'User added to group']);
    }

    public function removeUser(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $group = Group::findOrFail($id);
        $group->users()->detach($request->user_id);

        return response()->json(['message' => 'User removed from group']);
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'is_online' => 'required|boolean',
        ]);

        $group = Group::findOrFail($id);
        $userId = $request->user()->id;

        $group->users()->updateExistingPivot($userId, [
            'is_online' => $request->is_online,
            'last_seen' => now(),
        ]);

        broadcast(new UserStatusChanged($userId, $id, $request->is_online))->toOthers();

        return response()->json(['message' => 'Status updated']);
    }
}
