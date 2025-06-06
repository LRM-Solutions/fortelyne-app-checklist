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
export const enviarFormularioOrdem = async (ordemId, respostas) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Erro", "Token de autenticação não encontrado");
      return false;
    }

    // Mock temporário para teste - remover quando API estiver funcionando
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay da API

    console.log("Enviando formulário:", { ordemId, respostas });
    return { success: true, message: "Formulário enviado com sucesso!" };

    // Código real da API (comentado temporariamente)
    /*
    const response = await api.post(`/enviar-formulario-ordem/${ordemId}`, {
      respostas
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || { success: false };
    */
  } catch (error) {
    console.error("Erro ao enviar formulário:", error);

    let errorMessage = "Erro ao enviar formulário";

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Alert.alert("Erro", errorMessage);
    return { success: false, error: errorMessage };
  }
};
