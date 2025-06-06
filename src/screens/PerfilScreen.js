import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { logout } from "../api/authApi";
import { useAuth } from "../components/AuthProvider";

const PerfilScreen = () => {
  const { logout: authLogout } = useAuth();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAlterarSenha = async () => {
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "Nova senha e confirmação não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Aqui você implementaria a chamada para a API
      // await api.post('/change-password', { senhaAtual, novaSenha });

      // Simulando sucesso por enquanto
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Erro", "Erro ao alterar senha. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirmar Logout", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            authLogout();
            Alert.alert("Sucesso", "Logout realizado com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Erro ao fazer logout");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Gerenciar conta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações do Usuário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>Usuário Ativo</Text>
            <Text style={styles.infoLabel}>App:</Text>
            <Text style={styles.infoValue}>Fortelyne - Ordens de Serviço</Text>
          </View>
        </View>

        {/* Alterar Senha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha Atual</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Senha</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite a nova senha (min. 6 caracteres)"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite novamente a nova senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.alterarSenhaButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleAlterarSenha}
              disabled={isLoading}
            >
              <Text style={styles.alterarSenhaButtonText}>
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair do App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#9C27B0",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  alterarSenhaButton: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  alterarSenhaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PerfilScreen;
