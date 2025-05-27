"use client";

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import socket from "@/socket";
import apiRequest from "@/utils/apiCalls";
import { HttpMethod } from "@/utils/httpMethods";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  fullName: string;
  phone: string;
}

interface MessageData {
  from: string;
  to: string;
  message: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest({
          method: HttpMethod.GET,
          url: "/user",
        });
        setUsers(response);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const [selectedReceiver, setSelectedReceiver] = useState<User | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("User connected:", socket.id);
      console.log("Connected to WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect to update message listener on receiver change
  useEffect(() => {
    const handler = (messageData: MessageData) => {
      const { from, message } = messageData;
      if (from == `${selectedReceiver?.id}`) {
        setMessages((prev) => [
          ...prev,
          {
            text: message,
            sender: selectedReceiver ? selectedReceiver.fullName : "",
          },
        ]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler); // 💡 clean specific handler
    };
  }, [selectedReceiver]);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiRequest({
          method: HttpMethod.GET,
          url: `/message/history/${selectedReceiver?.id}`,
        });
        setMessages(response);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchMessages();
  }, [selectedReceiver]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !selectedReceiver) return;
    setMessages([...messages, { text: input, sender: "You" }]);
    console.log(546546, {
      receiverId: selectedReceiver?.id,
      message: input,
    });
    socket.emit("message", {
      receiverId: selectedReceiver?.id,
      message: input,
    });
    setInput("");
  };

  const handleLogout = async () => {
    await apiRequest({
      method: HttpMethod.POST,
      url: `/auth/logout`,
    });
    router.push("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      p={2}
      bgcolor="#f9f9f9"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" className="custom-typography">
          Chat Room
        </Typography>
        <IconButton onClick={handleLogout} color="error">
          <Typography variant="body2">Logout</Typography>
        </IconButton>
      </Box>

      {/* Receiver Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Receiver</InputLabel>
        <Select
          value={selectedReceiver?.id || ""}
          onChange={(e) => {
            const receiver = users.find((user) => user.id === e.target.value);
            setSelectedReceiver(receiver || null);
          }}
          label="Receiver"
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.phone} ({user.fullName})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          mb: 2,
        }}
      >
        {/* Chat Messages */}
        <List>
          {messages
            .filter((msg) =>
              selectedReceiver
                ? msg.sender === selectedReceiver.fullName ||
                  msg.sender === "You"
                : true
            )
            .map((msg, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${msg.sender}: ${msg.text}`}
                    style={{
                      textAlign: msg.sender === "You" ? "right" : "left",
                    }}
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </div>
            ))}
        </List>
      </Paper>

      {/* Message Input */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
