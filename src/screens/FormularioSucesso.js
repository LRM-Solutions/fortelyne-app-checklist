import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

const { width, height } = Dimensions.get("window");

const FormularioSucesso = ({ route, navigation }) => {
  const { resultado, formulario } = route.params || {};
  const [imagemModal, setImagemModal] = useState(null);

  const abrirImagemModal = (uri) => {
    setImagemModal(uri);
  };

  const fecharImagemModal = () => {
    setImagemModal(null);
  };

  const voltarParaOrdens = () => {
    // Navegar de volta para as ordens a fazer
    navigation.navigate("OrdensNavigator", { screen: "afazer" });
  };

  const renderResumoResposta = (pergunta, respostasPergunta, index) => {
    if (!pergunta || !respostasPergunta || respostasPergunta.length === 0)
      return null;

    console.log("Debug renderResumoResposta:", {
      pergunta: pergunta.pergunta_titulo,
      tipo: pergunta.pergunta_type_id,
      respostasPergunta,
    });

    let respostaTexto = "";

    // Definir o texto da resposta baseado no tipo
    if (pergunta.pergunta_type_id === "TEXTO") {
      const resposta = respostasPergunta[0];
      respostaTexto = resposta.resposta_texto || "Não respondido";
    } else if (pergunta.pergunta_type_id === "MULTIPLA") {
      // Para múltipla escolha, listar todas as opções selecionadas
      const opcoesSelecionadas = respostasPergunta.map((resposta) => {
        const escolha = pergunta.respostaEscolha?.find(
          (e) => e.resposta_escolha_id === resposta.resposta_escolha_id
        );
        return escolha?.resposta_label || "Opção não encontrada";
      });
      respostaTexto = opcoesSelecionadas.join(", ");
    } else if (pergunta.pergunta_type_id === "UNICA") {
      // Para única escolha, buscar o texto da escolha
      const resposta = respostasPergunta[0];
      const escolha = pergunta.respostaEscolha?.find(
        (e) => e.resposta_escolha_id === resposta.resposta_escolha_id
      );
      respostaTexto = escolha?.resposta_label || "Opção não encontrada";
    } else if (pergunta.pergunta_type_id === "ASSINATURA") {
      const resposta = respostasPergunta[0];
      console.log("Debug ASSINATURA:", {
        resposta,
        resposta_image_url: resposta.resposta_image_url,
        hasAssinatura: !!resposta.resposta_image_url,
      });
      respostaTexto = resposta.resposta_image_url
        ? "✓ Assinatura capturada"
        : "Não assinado";
    }

    const primeiraResposta = respostasPergunta[0];

    // Coletar todos os anexos das respostas desta pergunta
    const todosAnexos = [];
    respostasPergunta.forEach((resposta) => {
      // Formato antigo: resposta.anexos (base64)
      if (resposta.anexos && Array.isArray(resposta.anexos)) {
        todosAnexos.push(...resposta.anexos);
      }

      // Formato novo: resposta.respostaFinalImagens (URLs da API)
      if (
        resposta.respostaFinalImagens &&
        Array.isArray(resposta.respostaFinalImagens)
      ) {
        const imagensUrls = resposta.respostaFinalImagens.map(
          (img) => img.imagem_url
        );
        todosAnexos.push(...imagensUrls);
      }
    });

    return (
      <View
        key={`pergunta-${pergunta.formulario_pergunta_id}-${index}`}
        style={styles.respostaContainer}
      >
        <Text style={styles.perguntaTitle}>
          {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
        </Text>
        <Text style={styles.respostaTexto}>{respostaTexto}</Text>

        {/* Exibir assinatura se houver */}
        {pergunta.pergunta_type_id === "ASSINATURA" &&
          primeiraResposta?.resposta_image_url && (
            <View style={styles.assinaturaPreview}>
              <Text style={styles.anexosSectionTitle}>Assinatura:</Text>
              <TouchableOpacity
                onPress={() =>
                  abrirImagemModal(primeiraResposta.resposta_image_url)
                }
                activeOpacity={0.8}
                style={styles.assinaturaImageContainer}
              >
                <Image
                  source={{ uri: primeiraResposta.resposta_image_url }}
                  style={styles.assinaturaImage}
                  resizeMode="contain"
                />
                <View style={styles.assinaturaOverlay}>
                  <MaterialIcons name="zoom-in" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          )}

        {/* Exibir anexos se houver */}
        {todosAnexos.length > 0 && (
          <View style={styles.anexosSection}>
            <Text style={styles.anexosSectionTitle}>
              Anexos ({todosAnexos.length}):
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.anexosContainer}
              contentContainerStyle={styles.anexosContent}
            >
              {todosAnexos.map((anexo, anexoIndex) => (
                <TouchableOpacity
                  key={anexoIndex}
                  style={styles.anexoItem}
                  onPress={() => abrirImagemModal(anexo)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: anexo }}
                    style={styles.anexoImage}
                    resizeMode="cover"
                  />
                  <View style={styles.anexoOverlay}>
                    <MaterialIcons name="zoom-in" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
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
            {resultado?.data?.respostas && (
              <>
                {formulario.perguntas.map((pergunta, perguntaIndex) => {
                  // Buscar todas as respostas para esta pergunta
                  const respostasPergunta = resultado.data.respostas.filter(
                    (r) =>
                      r.formulario_pergunta_id ===
                      pergunta.formulario_pergunta_id
                  );

                  if (respostasPergunta.length === 0) return null;

                  return renderResumoResposta(
                    pergunta,
                    respostasPergunta,
                    perguntaIndex
                  );
                })}
              </>
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

      {/* Modal para visualização de imagem em tela cheia */}
      <Modal
        visible={!!imagemModal}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharImagemModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={fecharImagemModal}
          >
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={fecharImagemModal}
                >
                  <MaterialIcons name="close" size={28} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalImageContainer}>
                {imagemModal && (
                  <Image
                    source={{ uri: imagemModal }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        </View>
      </Modal>
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
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Espaço adicional para evitar sobreposição
  },
  header: {
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.primary,
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
  assinaturaPreview: {
    marginTop: theme.spacing.sm,
  },
  assinaturaImageContainer: {
    position: "relative",
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
  assinaturaImage: {
    width: "100%",
    height: 200,
    backgroundColor: "white",
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  assinaturaOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: theme.borderRadius.md,
    padding: 6,
  },
  anexosSection: {
    marginTop: theme.spacing.md,
  },
  anexosSectionTitle: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "600",
    fontSize: 14,
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  anexosContainer: {
    marginTop: theme.spacing.xs,
  },
  anexosContent: {
    paddingRight: theme.spacing.md,
  },
  anexoItem: {
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.sm,
    position: "relative",
  },
  anexoImage: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.muted + "20",
    borderRadius: theme.borderRadius.md,
  },
  anexoOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: theme.borderRadius.md,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalOverlay: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  closeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  modalImage: {
    width: width - 40,
    height: height - 200,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl, // Mais espaço na parte inferior
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
