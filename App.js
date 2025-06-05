import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/components/AuthProvider";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoadingScreen from "./src/components/LoadingScreen";

// Componente principal que renderiza baseado na autenticação
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
