import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";
import { getFormularioOrdem, enviarFormularioOrdem } from "../api/ordemApi";

const FormularioOrdem = ({ route, navigation }) => {
  const { ordem } = route.params || {};

  const [formulario, setFormulario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    if (ordem?.ordem_id) {
      carregarFormulario();
    }
  }, [ordem]);

  const carregarFormulario = async () => {
    setLoading(true);
    try {
      const response = await getFormularioOrdem(ordem.ordem_id);

      console.log(response);

      if (response.data && response.data.perguntas) {
        setFormulario(response.data);
        // Inicializar respostas vazias
        const respostasIniciais = {};
        response.data.perguntas.forEach((pergunta) => {
          if (pergunta.pergunta_type_id === "TEXTO") {
            respostasIniciais[pergunta.formulario_pergunta_id] = "";
          } else if (pergunta.pergunta_type_id === "MULTIPLA") {
            respostasIniciais[pergunta.formulario_pergunta_id] = [];
          }
        });
        setRespostas(respostasIniciais);
      }
    } catch (error) {
      console.error("Erro ao carregar formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiplaEscolha = (perguntaId, escolhaId) => {
    setRespostas((prev) => {
      const respostasAtuais = prev[perguntaId] || [];
      const jaEscolhido = respostasAtuais.includes(escolhaId);

      return {
        ...prev,
        [perguntaId]: jaEscolhido
          ? respostasAtuais.filter((id) => id !== escolhaId)
          : [...respostasAtuais, escolhaId],
      };
    });
  };

  const handleTextoChange = (perguntaId, texto) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: texto,
    }));
  };

  const handleSubmit = async () => {
    // Validar se todas as perguntas foram respondidas
    const perguntasNaoRespondidas = formulario.perguntas.filter((pergunta) => {
      const resposta = respostas[pergunta.formulario_pergunta_id];
      if (pergunta.pergunta_type_id === "TEXTO") {
        return !resposta || resposta.trim() === "";
      } else if (pergunta.pergunta_type_id === "MULTIPLA") {
        return !resposta || resposta.length === 0;
      }
      return false;
    });

    if (perguntasNaoRespondidas.length > 0) {
      Alert.alert(
        "Formulário Incompleto",
        "Por favor, responda todas as perguntas antes de enviar."
      );
      return;
    }

    // Confirmação antes do envio
    Alert.alert(
      "Confirmar Envio",
      "Deseja realmente enviar este formulário? Esta ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Enviar",
          style: "default",
          onPress: async () => {
            try {
              setEnviando(true);

              const resultado = await enviarFormularioOrdem(
                ordem.ordem_id,
                respostas,
                formulario
              );

              if (resultado.success) {
                // Navegar para tela de sucesso
                navigation.replace("FormularioSucesso", {
                  resultado,
                  formulario,
                });
              } else {
                Alert.alert(
                  "Erro",
                  resultado.error || "Erro ao enviar formulário"
                );
              }
            } catch (error) {
              console.error("Erro ao enviar formulário:", error);
              Alert.alert("Erro", "Erro inesperado ao enviar formulário");
            } finally {
              setEnviando(false);
            }
          },
        },
      ]
    );
  };

  const renderPergunta = (pergunta) => {
    const resposta = respostas[pergunta.formulario_pergunta_id];

    if (pergunta.pergunta_type_id === "MULTIPLA") {
      return (
        <View
          key={pergunta.formulario_pergunta_id}
          style={styles.perguntaContainer}
        >
          <Text style={styles.perguntaTitulo}>
            {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
          </Text>
          {pergunta.respostaEscolha.map((escolha) => (
            <TouchableOpacity
              key={escolha.resposta_escolha_id}
              style={styles.opcaoContainer}
              onPress={() =>
                handleMultiplaEscolha(
                  pergunta.formulario_pergunta_id,
                  escolha.resposta_escolha_id
                )
              }
            >
              <View
                style={[
                  styles.checkbox,
                  (resposta || []).includes(escolha.resposta_escolha_id) &&
                    styles.checkboxMarcado,
                ]}
              >
                {(resposta || []).includes(escolha.resposta_escolha_id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.opcaoTexto}>{escolha.resposta_label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (pergunta.pergunta_type_id === "TEXTO") {
      return (
        <View
          key={pergunta.formulario_pergunta_id}
          style={styles.perguntaContainer}
        >
          <Text style={styles.perguntaTitulo}>
            {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
          </Text>
          <TextInput
            style={styles.textArea}
            value={resposta || ""}
            onChangeText={(texto) =>
              handleTextoChange(pergunta.formulario_pergunta_id, texto)
            }
            placeholder="Digite sua resposta..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Carregando Formulário</Text>
          {ordem && (
            <Text style={styles.subtitle}>
              #{ordem.ordem_id} - {ordem.ordem_nome_cliente}
            </Text>
          )}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando formulário...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!formulario) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Erro</Text>
          {ordem && (
            <Text style={styles.subtitle}>
              #{ordem.ordem_id} - {ordem.ordem_nome_cliente}
            </Text>
          )}
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Não foi possível carregar o formulário para esta ordem.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={carregarFormulario}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
                <Text style={styles.infoValue}>
                  {ordem.ordem_endereco}
                  {ordem.ordem_cidade && `, ${ordem.ordem_cidade}`}
                  {ordem.ordem_estado && ` - ${ordem.ordem_estado}`}
                  {ordem.ordem_cep && ` - ${ordem.ordem_cep}`}
                </Text>

                {ordem.ordem_tipo && (
                  <>
                    <Text style={styles.infoLabel}>Tipo:</Text>
                    <Text style={styles.infoValue}>{ordem.ordem_tipo}</Text>
                  </>
                )}

                {ordem.ordem_descricao && (
                  <>
                    <Text style={styles.infoLabel}>Descrição:</Text>
                    <Text style={styles.infoValue}>
                      {ordem.ordem_descricao}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>
              {formulario.formulario_nome}
            </Text>

            {formulario.perguntas &&
              formulario.perguntas.map((pergunta) => renderPergunta(pergunta))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, enviando && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Salvar Formulário</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={enviando}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    ...createTextStyle("body", "muted"),
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    ...createTextStyle("body", "muted"),
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    ...createButtonStyle("outline", "md"),
  },
  retryButtonText: {
    ...createTextStyle("body", "primary"),
    fontWeight: "600",
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
  perguntaContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  perguntaTitulo: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  opcaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  checkboxMarcado: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  opcaoTexto: {
    ...createTextStyle("body", "foreground"),
    flex: 1,
  },
  textArea: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.foreground,
    minHeight: 80,
    textAlignVertical: "top",
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
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    ...createButtonStyle("success", "lg"),
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
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default FormularioOrdem;
