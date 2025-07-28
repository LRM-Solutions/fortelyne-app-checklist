import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";
import {
  getRespostasFinaisOrdem,
  getFormularioOrdem,
  editarFormularioOrdem,
} from "../api/ordemApi";
import { MaterialIcons } from "@expo/vector-icons";
import AssinaturaComponent from "../components/AssinaturaComponent";

const ExecucaoOrdem = ({ route, navigation }) => {
  const { ordem } = route.params || {};

  const [formulario, setFormulario] = useState(null);
  const [respostasFinais, setRespostasFinais] = useState([]);
  const [respostasEditaveis, setRespostasEditaveis] = useState({});
  const [loading, setLoading] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [podeEditar, setPodeEditar] = useState(false);

  useEffect(() => {
    if (ordem?.ordem_id) {
      carregarDados();
    }
  }, [ordem]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar formulário estrutural e respostas finais em paralelo
      const [formularioResponse, respostasResponse] = await Promise.all([
        getFormularioOrdem(ordem.ordem_id),
        getRespostasFinaisOrdem(ordem.ordem_id),
      ]);

      if (formularioResponse?.data && respostasResponse?.respostas) {
        setFormulario(formularioResponse.data);
        setRespostasFinais(respostasResponse.respostas);

        // Verificar se pode editar (menos de 24h da ordem_data)
        const ordemData = new Date(
          respostasResponse.ordem?.ordem_data || ordem.ordem_data
        );
        const agora = new Date();
        const diferencaHoras = (agora - ordemData) / (1000 * 60 * 60);
        setPodeEditar(diferencaHoras < 24);

        // Mapear respostas finais para o formato editável
        const respostasMap = {};

        formularioResponse.data.perguntas.forEach((pergunta) => {
          const perguntaId = pergunta.formulario_pergunta_id;
          const respostasDaPergunta = respostasResponse.respostas.filter(
            (r) => r.formulario_pergunta_id === perguntaId
          );

          if (pergunta.pergunta_type_id === "TEXTO") {
            respostasMap[perguntaId] =
              respostasDaPergunta[0]?.resposta_texto || "";
          } else if (pergunta.pergunta_type_id === "MULTIPLA") {
            respostasMap[perguntaId] = respostasDaPergunta
              .map((r) => r.resposta_escolha_id)
              .filter((id) => id);
          } else if (pergunta.pergunta_type_id === "UNICA") {
            respostasMap[perguntaId] =
              respostasDaPergunta[0]?.resposta_escolha_id || null;
          } else if (pergunta.pergunta_type_id === "ASSINATURA") {
            respostasMap[perguntaId] =
              respostasDaPergunta[0]?.resposta_image_url || null;
          }
        });

        setRespostasEditaveis(respostasMap);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Erro ao carregar dados da ordem");
    } finally {
      setLoading(false);
    }
  };

  const handleUnicaEscolha = (perguntaId, escolhaId) => {
    if (!modoEdicao) return;

    setRespostasEditaveis((prev) => ({
      ...prev,
      [perguntaId]: escolhaId,
    }));
  };

  const handleMultiplaEscolha = (perguntaId, escolhaId) => {
    if (!modoEdicao) return;

    setRespostasEditaveis((prev) => {
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
    if (!modoEdicao) return;

    setRespostasEditaveis((prev) => ({
      ...prev,
      [perguntaId]: texto,
    }));
  };

  const handleAssinatura = (perguntaId, assinaturaBase64) => {
    if (!modoEdicao) return;

    setRespostasEditaveis((prev) => ({
      ...prev,
      [perguntaId]: assinaturaBase64,
    }));
  };

  const handleToggleEdicao = () => {
    if (!podeEditar) {
      Alert.alert(
        "Edição não permitida",
        "Esta ordem só pode ser editada dentro de 24 horas após a conclusão."
      );
      return;
    }

    if (modoEdicao) {
      // Cancelar edição - restaurar valores originais
      Alert.alert(
        "Cancelar Edição",
        "Deseja cancelar as alterações? As modificações não salvas serão perdidas.",
        [
          { text: "Continuar Editando", style: "cancel" },
          {
            text: "Cancelar",
            style: "destructive",
            onPress: () => {
              setModoEdicao(false);
              carregarDados(); // Recarregar dados originais
            },
          },
        ]
      );
    } else {
      setModoEdicao(true);
    }
  };

  const handleSalvarEdicao = () => {
    // Validar se todas as perguntas foram respondidas
    const perguntasNaoRespondidas = formulario.perguntas.filter((pergunta) => {
      const resposta = respostasEditaveis[pergunta.formulario_pergunta_id];
      if (pergunta.pergunta_type_id === "TEXTO") {
        return !resposta || resposta.trim() === "";
      } else if (pergunta.pergunta_type_id === "MULTIPLA") {
        return !resposta || resposta.length === 0;
      } else if (pergunta.pergunta_type_id === "UNICA") {
        return resposta === null || resposta === undefined;
      } else if (pergunta.pergunta_type_id === "ASSINATURA") {
        return !resposta;
      }
      return false;
    });

    if (perguntasNaoRespondidas.length > 0) {
      Alert.alert(
        "Formulário Incompleto",
        "Por favor, responda todas as perguntas antes de salvar."
      );
      return;
    }

    Alert.alert(
      "Salvar Alterações",
      "Deseja realmente salvar as alterações feitas no formulário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: async () => {
            setSalvando(true);
            try {
              const resultado = await editarFormularioOrdem(
                ordem.ordem_id,
                respostasEditaveis,
                formulario
              );

              if (resultado.success) {
                setModoEdicao(false);
                Alert.alert("Sucesso", "Alterações salvas com sucesso!", [
                  {
                    text: "OK",
                    onPress: () => {
                      // Recarregar dados para mostrar as mudanças
                      carregarDados();
                    },
                  },
                ]);
              } else {
                Alert.alert(
                  "Erro",
                  resultado.error || "Erro ao salvar alterações"
                );
              }
            } catch (error) {
              console.error("Erro ao salvar edição:", error);
              Alert.alert("Erro", "Erro inesperado ao salvar alterações");
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  const renderPergunta = (pergunta) => {
    const resposta = respostasEditaveis[pergunta.formulario_pergunta_id];
    const isDisabled = !modoEdicao;

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
              style={[
                styles.opcaoContainer,
                isDisabled && styles.opcaoContainerDisabled,
              ]}
              onPress={() =>
                handleMultiplaEscolha(
                  pergunta.formulario_pergunta_id,
                  escolha.resposta_escolha_id
                )
              }
              disabled={isDisabled}
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
              <Text
                style={[
                  styles.opcaoTexto,
                  isDisabled && styles.opcaoTextoDisabled,
                ]}
              >
                {escolha.resposta_label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (pergunta.pergunta_type_id === "UNICA") {
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
              style={[
                styles.opcaoContainer,
                isDisabled && styles.opcaoContainerDisabled,
              ]}
              onPress={() =>
                handleUnicaEscolha(
                  pergunta.formulario_pergunta_id,
                  escolha.resposta_escolha_id
                )
              }
              disabled={isDisabled}
            >
              <View
                style={[
                  styles.radioButton,
                  resposta === escolha.resposta_escolha_id &&
                    styles.radioButtonMarcado,
                ]}
              >
                {resposta === escolha.resposta_escolha_id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.opcaoTexto,
                  isDisabled && styles.opcaoTextoDisabled,
                ]}
              >
                {escolha.resposta_label}
              </Text>
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
            style={[styles.textArea, isDisabled && styles.textAreaDisabled]}
            value={resposta || ""}
            onChangeText={(texto) =>
              handleTextoChange(pergunta.formulario_pergunta_id, texto)
            }
            placeholder="Digite sua resposta..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isDisabled}
          />
        </View>
      );
    } else if (pergunta.pergunta_type_id === "ASSINATURA") {
      return (
        <View
          key={pergunta.formulario_pergunta_id}
          style={styles.perguntaContainer}
        >
          <Text style={styles.perguntaTitulo}>
            {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
          </Text>
          <AssinaturaComponent
            onSignatureCapture={(assinatura) =>
              handleAssinatura(pergunta.formulario_pergunta_id, assinatura)
            }
            value={resposta}
            disabled={isDisabled}
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
          <Text style={styles.title}>Carregando Execução</Text>
          {ordem && (
            <Text style={styles.subtitle}>
              #{ordem.ordem_id} - {ordem.ordem_nome_cliente}
            </Text>
          )}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando dados da ordem...</Text>
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
          <MaterialIcons
            name="error-outline"
            size={48}
            color={theme.colors.muted}
          />
          <Text style={styles.emptyText}>
            Não foi possível carregar os dados desta ordem.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={carregarDados}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Execução da Ordem</Text>
        {ordem && (
          <Text style={styles.subtitle}>
            #{ordem.ordem_id} - {ordem.ordem_nome_cliente}
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Informações da Ordem */}
            {ordem && (
              <View style={styles.ordemInfo}>
                <Text style={styles.sectionTitle}>Informações da Ordem</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Cliente:</Text>
                  <Text style={styles.infoValue}>
                    {ordem.ordem_nome_cliente}
                  </Text>

                  <Text style={styles.infoLabel}>Endereço:</Text>
                  <Text style={styles.infoValue}>
                    {ordem.ordem_endereco}
                    {ordem.ordem_cidade && `, ${ordem.ordem_cidade}`}
                    {ordem.ordem_estado && ` - ${ordem.ordem_estado}`}
                    {ordem.ordem_cep && ` - ${ordem.ordem_cep}`}
                  </Text>

                  <Text style={styles.infoLabel}>Data:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(ordem.ordem_data).toLocaleDateString("pt-BR")}
                  </Text>

                  <View style={styles.statusRow}>
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.primary, marginLeft: 8 },
                      ]}
                    >
                      Ordem Concluída
                    </Text>
                  </View>

                  {podeEditar && (
                    <View style={styles.edicaoAviso}>
                      <MaterialIcons
                        name="info"
                        size={16}
                        color={theme.colors.warning}
                      />
                      <Text style={styles.edicaoAvisoTexto}>
                        Esta ordem pode ser editada (menos de 24h)
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Formulário */}
            <View style={styles.formSection}>
              <View style={styles.formHeader}>
                <Text style={styles.sectionTitle}>
                  {formulario.formulario_nome}
                </Text>

                {podeEditar && (
                  <TouchableOpacity
                    style={[
                      styles.editButton,
                      modoEdicao && styles.editButtonActive,
                    ]}
                    onPress={handleToggleEdicao}
                  >
                    <MaterialIcons
                      name={modoEdicao ? "close" : "edit"}
                      size={20}
                      color={
                        modoEdicao
                          ? theme.colors.destructive
                          : theme.colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.editButtonText,
                        modoEdicao && styles.editButtonTextActive,
                      ]}
                    >
                      {modoEdicao ? "Cancelar" : "Editar"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {formulario.perguntas &&
                formulario.perguntas.map((pergunta) =>
                  renderPergunta(pergunta)
                )}
            </View>

            {/* Botões de Ação */}
            {modoEdicao && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.saveButton, salvando && styles.buttonDisabled]}
                  onPress={handleSalvarEdicao}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <MaterialIcons name="save" size={20} color="white" />
                      <Text style={styles.saveButtonText}>
                        Salvar Alterações
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
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
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 30 : 50,
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
    marginVertical: theme.spacing.md,
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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  edicaoAviso: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.warning + "20",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  edicaoAvisoTexto: {
    ...createTextStyle("caption", "warning"),
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  formSection: {
    marginBottom: theme.spacing.lg,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButtonActive: {
    backgroundColor: theme.colors.destructive + "20",
    borderColor: theme.colors.destructive,
  },
  editButtonText: {
    ...createTextStyle("body", "primary"),
    fontWeight: "600",
    marginLeft: 4,
  },
  editButtonTextActive: {
    color: theme.colors.destructive,
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
  opcaoContainerDisabled: {
    opacity: 0.7,
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
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 10,
    marginRight: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  radioButtonMarcado: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  opcaoTexto: {
    ...createTextStyle("body", "foreground"),
    flex: 1,
  },
  opcaoTextoDisabled: {
    opacity: 0.7,
  },
  textArea: {
    backgroundColor: theme.colors.muted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    color: theme.colors.foreground,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: "top",
  },
  textAreaDisabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  saveButton: {
    ...createButtonStyle("primary", "lg"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    ...createTextStyle("body", "white"),
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ExecucaoOrdem;
