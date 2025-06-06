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
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

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
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...createTextStyle("h2", "white"),
    marginBottom: 5,
  },
  subtitle: {
    ...createTextStyle("body", "white"),
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...createTextStyle("h3", "foreground"),
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoLabel: {
    ...createTextStyle("caption", "muted"),
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...createTextStyle("body", "foreground"),
    marginBottom: theme.spacing.md,
  },
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...createTextStyle("caption", "foreground"),
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    backgroundColor: theme.colors.muted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.foreground,
  },
  alterarSenhaButton: {
    ...createButtonStyle("primary", "md"),
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.mutedForeground,
  },
  alterarSenhaButtonText: {
    ...createTextStyle("body", "white"),
    fontWeight: "bold",
  },
  logoutButton: {
    ...createButtonStyle("destructive", "md"),
    ...theme.shadows.md,
    marginBottom: 20,
  },
  logoutButtonText: {
    ...createTextStyle("body", "white"),
    fontWeight: "bold",
  },
});

export default PerfilScreen;
