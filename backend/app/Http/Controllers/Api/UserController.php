<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentUserId = $request->user()->id;

        // Get all users except the current user
        $users = User::where('id', '!=', $currentUserId)
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Search users by name or email.
     */
    public function search(Request $request)
    {
        $query = $request->query('q');
        $currentUserId = $request->user()->id;

        $users = User::where('id', '!=', $currentUserId)
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'email')
            ->limit(10)
            ->get();

        return response()->json($users);
    }
}
