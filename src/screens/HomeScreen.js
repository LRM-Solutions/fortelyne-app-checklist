import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { logout } from "../api/authApi";
import { useAuth } from "../components/AuthProvider";

export default function HomeScreen() {
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      authLogout(); // Atualizar estado de autenticação
      Alert.alert("Sucesso", "Logout realizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer logout");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Message */}
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo ao App!</Text>
          <Text style={styles.subtitle}>Você está logado com sucesso</Text>
        </View>

        {/* Content Area */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>🎉 Autenticação realizada!</Text>
          <Text style={styles.messageText}>
            Agora você pode acessar todas as funcionalidades do aplicativo.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
    fontSize: 18,
  },
  messageCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    padding: 24,
    marginBottom: 32,
    width: "100%",
  },
  messageTitle: {
    color: "#1e40af",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  messageText: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
  },
  logoutButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
  },
});
