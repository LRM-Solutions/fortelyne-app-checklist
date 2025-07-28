import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

const FormularioSucesso = ({ route, navigation }) => {
  const { resultado, formulario } = route.params || {};

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

    return (
      <View
        key={`pergunta-${pergunta.formulario_pergunta_id}-${index}`}
        style={styles.respostaContainer}
      >
        <Text style={styles.perguntaTitle}>
          {pergunta.pergunta_indice}. {pergunta.pergunta_titulo}
        </Text>
        <Text style={styles.respostaTexto}>{respostaTexto}</Text>
        {pergunta.pergunta_type_id === "ASSINATURA" &&
          primeiraResposta?.resposta_image_url && (
            <View style={styles.assinaturaPreview}>
              <Image
                source={{ uri: primeiraResposta.resposta_image_url }}
                style={styles.assinaturaImage}
                resizeMode="contain"
              />
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
    height: 200,
    backgroundColor: "white",
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs,
  },
  assinaturaImage: {
    width: "100%",
    height: "100%",
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
