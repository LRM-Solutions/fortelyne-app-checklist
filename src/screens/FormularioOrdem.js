import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

const FormularioOrdem = ({ route, navigation }) => {
  const { ordem } = route.params || {};

  const [formData, setFormData] = useState({
    observacoes: "",
    materiais: "",
    tempoGasto: "",
    statusFinal: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    Alert.alert(
      "Formulário Enviado",
      "Os dados da ordem de serviço foram salvos com sucesso!",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Formulário da Ordem</Text>
          {ordem && (
            <Text style={styles.subtitle}>
              #{ordem.ordem_id} - {ordem.ordem_nome_cliente}
            </Text>
          )}
        </View>

        <View style={styles.content}>
          {ordem && (
            <View style={styles.ordemInfo}>
              <Text style={styles.sectionTitle}>Informações da Ordem</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{ordem.ordem_nome_cliente}</Text>

                <Text style={styles.infoLabel}>Endereço:</Text>
                <Text style={styles.infoValue}>{ordem.ordem_endereco}</Text>

                <Text style={styles.infoLabel}>Tipo:</Text>
                <Text style={styles.infoValue}>{ordem.ordem_tipo}</Text>

                <Text style={styles.infoLabel}>Descrição:</Text>
                <Text style={styles.infoValue}>{ordem.ordem_descricao}</Text>
              </View>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Preenchimento do Serviço</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observações do Serviço</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Descreva como foi executado o serviço..."
                value={formData.observacoes}
                onChangeText={(value) =>
                  handleInputChange("observacoes", value)
                }
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Materiais Utilizados</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Liste os materiais utilizados..."
                value={formData.materiais}
                onChangeText={(value) => handleInputChange("materiais", value)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo Gasto (horas)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: 2.5"
                value={formData.tempoGasto}
                onChangeText={(value) => handleInputChange("tempoGasto", value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Status Final</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Concluído, Pendente de material, etc."
                value={formData.statusFinal}
                onChangeText={(value) =>
                  handleInputChange("statusFinal", value)
                }
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Salvar Formulário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
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
    padding: theme.spacing.lg,
  },
  ordemInfo: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...createTextStyle("h3", "foreground"),
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  formSection: {
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.foreground,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    ...createButtonStyle("primary", "lg"),
    marginBottom: theme.spacing.md,
  },
  submitButtonText: {
    ...createTextStyle("body", "white"),
    fontWeight: "bold",
  },
  cancelButton: {
    ...createButtonStyle("outline", "lg"),
  },
  cancelButtonText: {
    ...createTextStyle("body", "muted"),
    fontWeight: "600",
  },
});

export default FormularioOrdem;
