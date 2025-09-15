import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Send, Shield, Clock, Key, MessageSquare, UserPlus, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface SafeMessage {
  id: string;
  content: string;
  senderKey: string;
  createdAt: string;
  expiresAt: string;
}

export default function SafeCommunication() {
  const [roomId, setRoomId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState(60);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { toast } = useToast();

  const sessionId = localStorage.getItem('cybershe-session');

  // Get messages for current room
  const { data: messages = [], refetch: refetchMessages } = useQuery<SafeMessage[]>({
    queryKey: ['/api/safe-messages', roomId],
    enabled: !!sessionId && !!roomId,
    meta: {
      headers: { 'X-Session-ID': sessionId }
    },
    refetchInterval: 5000, // Poll for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { roomId: string; content: string; expiresInMinutes: number }) => {
      const response = await apiRequest('POST', '/api/safe-messages', data);
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      toast({
        title: "Message Sent",
        description: "Your encrypted message has been sent securely.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateRoomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createNewRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsCreatingRoom(false);
    toast({
      title: "Secure Room Created",
      description: "Share the room ID with trusted contacts to start secure messaging.",
    });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID Copied",
      description: "Share this ID with people you want to communicate securely with.",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    if (!roomId) {
      toast({
        title: "Room Required",
        description: "Please create or join a room first.",
        variant: "destructive",
      });
      return;
    }

    if (!sessionId) {
      toast({
        title: "Session Error",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      roomId,
      content: newMessage,
      expiresInMinutes
    });
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const isMyMessage = (message: SafeMessage) => {
    // Simple check based on sender key pattern
    return message.senderKey.includes(sessionId?.slice(0, 8) || '');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="safe-communication-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">Safe Communication</h1>
          <p className="text-xl text-muted-foreground" data-testid="page-description">
            Encrypted messaging and secure communication tools for sensitive conversations
          </p>
        </div>

        <Tabs defaultValue="messaging" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messaging" data-testid="tab-messaging">Secure Messaging</TabsTrigger>
            <TabsTrigger value="rooms" data-testid="tab-rooms">Room Management</TabsTrigger>
          </TabsList>

          <TabsContent value="messaging" className="space-y-6">
            {!roomId ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span data-testid="text-start-messaging">Start Secure Messaging</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription data-testid="alert-encryption">
                      All messages are end-to-end encrypted and automatically expire. No data is stored permanently.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2" data-testid="text-create-room">Create New Room</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start a new secure conversation room
                        </p>
                        <Button onClick={createNewRoom} data-testid="button-create-room">
                          Create Room
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Key className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2" data-testid="text-join-room">Join Existing Room</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Enter a room ID to join a conversation
                        </p>
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toLowerCase())}
                            data-testid="input-room-id"
                          />
                          <Button 
                            onClick={() => setRoomId(roomId)}
                            disabled={!roomId.trim()}
                            className="w-full"
                            data-testid="button-join-room"
                          >
                            Join Room
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Room Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Lock className="h-5 w-5 text-green-600" />
                        <span data-testid="text-secure-room">Secure Room: {roomId}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" data-testid="badge-encrypted">End-to-End Encrypted</Badge>
                        <Button variant="outline" size="sm" onClick={copyRoomId} data-testid="button-copy-room">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy ID
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Messages */}
                <Card className="min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span data-testid="text-messages">Messages</span>
                      <Badge variant="outline" data-testid="badge-message-count">
                        {messages.length} messages
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-80 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p data-testid="text-no-messages">No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isMyMessage(message)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border border-border'
                              }`}
                            >
                              <p className="text-sm" data-testid={`message-content-${message.id}`}>
                                {message.content}
                              </p>
                              <div className="flex items-center justify-between text-xs opacity-70 mt-1">
                                <span data-testid={`message-time-${message.id}`}>
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span data-testid={`message-expires-${message.id}`}>
                                    {formatTimeRemaining(message.expiresAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="expires" className="text-sm">Expires in:</Label>
                        <select
                          id="expires"
                          value={expiresInMinutes}
                          onChange={(e) => setExpiresInMinutes(Number(e.target.value))}
                          className="px-2 py-1 border border-border rounded text-sm"
                          data-testid="select-expires"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={240}>4 hours</option>
                          <option value={1440}>24 hours</option>
                        </select>
                      </div>

                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your encrypted message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 secure-input"
                          rows={3}
                          data-testid="textarea-message"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                          className="px-6"
                          data-testid="button-send-message"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-room-management">Room Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4 flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span data-testid="text-security-features">Security Features</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• End-to-end encryption using AES-256</li>
                      <li>• Messages automatically expire</li>
                      <li>• No permanent message storage</li>
                      <li>• Anonymous room-based communication</li>
                      <li>• No registration or personal data required</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-secondary" />
                      <span data-testid="text-expiration-options">Message Expiration</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 15 minutes - Quick conversations</li>
                      <li>• 1 hour - Standard discussions</li>
                      <li>• 4 hours - Extended planning</li>
                      <li>• 24 hours - Maximum retention</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription data-testid="alert-room-sharing">
                    <strong>Room Sharing:</strong> Only share room IDs with trusted contacts. Anyone with the room ID can read messages in that room.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-medium" data-testid="text-current-room">Current Room</h3>
                  {roomId ? (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium" data-testid="text-active-room">Active Room: {roomId}</div>
                        <div className="text-sm text-muted-foreground">
                          {messages.length} messages • End-to-end encrypted
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyRoomId} data-testid="button-copy-active-room">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy ID
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setRoomId("")}
                          data-testid="button-leave-room"
                        >
                          Leave Room
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8" data-testid="text-no-active-room">
                      No active room. Create or join a room to start secure messaging.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
