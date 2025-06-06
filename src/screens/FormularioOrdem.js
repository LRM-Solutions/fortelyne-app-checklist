import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

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
              onChangeText={(value) => handleInputChange("observacoes", value)}
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
              onChangeText={(value) => handleInputChange("statusFinal", value)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
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
    padding: 20,
  },
  ordemInfo: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
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
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FormularioOrdem;
