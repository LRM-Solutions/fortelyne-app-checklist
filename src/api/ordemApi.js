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
