"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import apiRequest from "@/utils/apiCalls";
import { HttpMethod } from "@/utils/httpMethods";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    try {
      const filteredUserName = username.trim();
      const filteredPassword = password.trim();
      await apiRequest({
        method: HttpMethod.POST,
        url: "/auth/login",
        data: {
          password: filteredPassword,
          phone: filteredUserName,
          email: filteredUserName,
        },
      });
      router.push("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} bgcolor="white" boxShadow={3} borderRadius={2}>
        <Typography variant="h5" gutterBottom className="custom-typography">
          Enter your credentials
        </Typography>
        <TextField
          fullWidth
          label="Email/Phone Number"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" fullWidth onClick={handleLogin}>
          Enter Chat
        </Button>
      </Box>
    </Container>
  );
}
