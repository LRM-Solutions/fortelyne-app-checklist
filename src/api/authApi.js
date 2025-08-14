import api from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
// Função de login
export const login = async (userEmail, userPassword) => {
  try {
    const response = await api.post("/login", {
      user_email: userEmail,
      user_password: userPassword,
    });

    // Armazenar o token no AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem("auth_token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);

    let errorMessage = error.response.data.error;

    Toast.show({
      type: "error",
      text1: "Erro no Login",
      text2: errorMessage,
      visibilityTime: 4000,
    });
  }
};

// Função para logout
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("auth_token");
    return true;
  } catch (error) {
    console.error("Erro no logout:", error);
    throw error;
  }
};

// Função para verificar se o usuário está logado
export const checkAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token !== null;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return false;
  }
};

// Função para obter o token atual
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem("auth_token");
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
};
