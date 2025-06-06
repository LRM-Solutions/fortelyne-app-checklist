import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

const FormularioSucesso = ({ route, navigation }) => {
  const { resultado, formulario } = route.params || {};

  const voltarParaOrdens = () => {
    // Navegar de volta para as ordens a fazer
    navigation.navigate("OrdensNavigator", { screen: "afazer" });
  };

  const renderResumoResposta = (resposta, index) => {
    // Encontrar a pergunta correspondente
    const pergunta = formulario.perguntas.find(
      (p) => p.formulario_pergunta_id === resposta.formulario_pergunta_id
    );

    if (!pergunta) return null;

    return (
      <View
        key={`${resposta.resposta_final_id}-${index}`}
        style={styles.respostaContainer}
      >
        <Text style={styles.perguntaTitle}>
          {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
        </Text>
        <Text style={styles.respostaTexto}>{resposta.resposta_texto}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Formulário Enviado!</Text>
          <Text style={styles.subtitle}>
            O formulário foi preenchido e enviado com sucesso
          </Text>
        </View>

        <View style={styles.content}>
          {resultado?.data?.ordem && (
            <View style={styles.ordemInfo}>
              <Text style={styles.sectionTitle}>Ordem de Serviço</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>ID da Ordem:</Text>
                <Text style={styles.infoValue}>
                  #{resultado.data.ordem.ordem_id}
                </Text>

                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>
                  {resultado.data.ordem.ordem_nome_cliente}
                </Text>

                <Text style={styles.infoLabel}>Endereço:</Text>
                <Text style={styles.infoValue}>
                  {resultado.data.ordem.ordem_endereco}
                  {resultado.data.ordem.ordem_cidade &&
                    `, ${resultado.data.ordem.ordem_cidade}`}
                  {resultado.data.ordem.ordem_estado &&
                    ` - ${resultado.data.ordem.ordem_estado}`}
                  {resultado.data.ordem.ordem_cep &&
                    ` - ${resultado.data.ordem.ordem_cep}`}
                </Text>

                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[styles.infoValue, styles.statusConcluido]}>
                  {resultado.data.ordem.ordem_concluida
                    ? "Concluída"
                    : "Pendente"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.resumoSection}>
            <Text style={styles.sectionTitle}>Resumo das Respostas</Text>
            {resultado?.data?.respostas &&
              resultado.data.respostas.map((resposta, index) =>
                renderResumoResposta(resposta, index)
              )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.voltarButton}
              onPress={voltarParaOrdens}
            >
              <Text style={styles.voltarButtonText}>
                Voltar para Ordens de Serviço
              </Text>
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
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.success,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    ...createTextStyle("h2", "white"),
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    ...createTextStyle("body", "white"),
    opacity: 0.9,
    textAlign: "center",
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
  statusConcluido: {
    color: theme.colors.success,
    fontWeight: "600",
  },
  resumoSection: {
    marginBottom: theme.spacing.lg,
  },
  respostaContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  perguntaTitle: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    fontSize: 16,
  },
  respostaTexto: {
    ...createTextStyle("body", "muted"),
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  voltarButton: {
    ...createButtonStyle("primary", "lg"),
  },
  voltarButtonText: {
    ...createTextStyle("body", "white"),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FormularioSucesso;
