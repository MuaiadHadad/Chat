<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $groupId = $request->query('group_id');

        $query = Message::with('user');

        if ($groupId) {
            $query->where('group_id', $groupId);
        }

        $messages = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'user_id' => $request->user()->id,
            'group_id' => $request->group_id,
            'content' => $request->content,
        ]);

        // Recarregar a mensagem com o usuário
        $message->load('user');

        // Transmitir o evento
        broadcast(new MessageSent($message));

        return response()->json($message, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $message = Message::with('user')->findOrFail($id);
        return response()->json($message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $message = Message::findOrFail($id);

        // Only allow user to update their own messages
        if ($message->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $message->update(['content' => $request->content]);

        return response()->json($message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $message = Message::findOrFail($id);

        // Only allow user to delete their own messages
        if ($message->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }
}
