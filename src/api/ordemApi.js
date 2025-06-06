import api from "./apiConfig";
import { Alert } from "react-native";
import { getAuthToken } from "./authApi";

// Função para buscar ordens concluídas
export const getOrdensConcluidas = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Erro", "Token de autenticação não encontrado");
      return [];
    }

    const response = await api.get("/get-all-done-orders-by-user-id", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar ordens concluídas:", error);

    let errorMessage = "Erro ao buscar ordens concluídas";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert("Erro", errorMessage);
    return [];
  }
};

// Função para buscar ordens a fazer
export const getOrdensAFazer = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Erro", "Token de autenticação não encontrado");
      return [];
    }

    const response = await api.get("/get-incompleted-orders-by-user-id", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar ordens a fazer:", error);

    let errorMessage = "Erro ao buscar ordens a fazer";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert("Erro", errorMessage);
    return [];
  }
};

// Função para buscar formulário da ordem
export const getFormularioOrdem = async (ordemId) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Erro", "Token de autenticação não encontrado");
      return null;
    }

    console.log(`Fazendo requisição para: /formulario-ordem/${ordemId}`);

    const response = await api.get(`/formulario-ordem/${ordemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar formulário da ordem:", error);

    let errorMessage = "Erro ao buscar formulário da ordem";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert("Erro", errorMessage);
    return null;
  }
};

// Função para enviar formulário preenchido
export const enviarFormularioOrdem = async (ordemId, respostas, formulario) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Erro", "Token de autenticação não encontrado");
      return { success: false, error: "Token de autenticação não encontrado" };
    }

    // Transformar respostas para o formato esperado pela API
    const respostasFormatadas = [];

    Object.keys(respostas).forEach((perguntaId) => {
      const resposta = respostas[perguntaId];
      const pergunta = formulario.perguntas.find(
        (p) => p.formulario_pergunta_id.toString() === perguntaId.toString()
      );

      if (!pergunta) return;

      if (pergunta.pergunta_type_id === "TEXTO") {
        // Para perguntas de texto
        respostasFormatadas.push({
          formulario_pergunta_id: parseInt(perguntaId),
          resposta_texto: resposta,
          ordem_id: ordemId,
          resposta_escolha_id: null,
        });
      } else if (pergunta.pergunta_type_id === "MULTIPLA") {
        // Para perguntas de múltipla escolha
        resposta.forEach((escolhaId) => {
          const escolha = pergunta.respostaEscolha.find(
            (e) => e.resposta_escolha_id === escolhaId
          );
          if (escolha) {
            respostasFormatadas.push({
              formulario_pergunta_id: parseInt(perguntaId),
              resposta_texto: escolha.resposta_label,
              ordem_id: ordemId,
              resposta_escolha_id: escolhaId,
            });
          }
        });
      }
    });

    console.log("Payload formatado:", {
      ordem_id: ordemId,
      respostas: respostasFormatadas,
    });

    const response = await api.post(
      "/envio-formulario",
      {
        ordem_id: ordemId,
        respostas: respostasFormatadas,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Resposta do envio:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar formulário:", error);

    let errorMessage = "Erro ao enviar formulário";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};
