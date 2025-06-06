import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./src/components/AuthProvider";
import LoginScreen from "./src/screens/LoginScreen";
import LoadingScreen from "./src/components/LoadingScreen";
import OrdensNavigator from "./src/screens/OrdensNavigator";
import FormularioOrdem from "./src/screens/FormularioOrdem";

const Stack = createStackNavigator();

// Componente principal que renderiza baseado na autenticação
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="OrdensNavigator" component={OrdensNavigator} />
        <Stack.Screen
          name="FormularioOrdem"
          component={FormularioOrdem}
          options={{
            headerShown: true,
            title: "Formulário",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
