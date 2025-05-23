"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    try {
      const filteredUserName = username.trim();
      const filteredPassword = password.trim();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/v1/auth/login`, {
        password: filteredPassword,
        phone: filteredUserName,
        email: filteredUserName
      });
      localStorage.setItem("accessToken", response?.data);

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
