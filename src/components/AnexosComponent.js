import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { theme, createTextStyle } from "../utils/theme";

const { width } = Dimensions.get("window");

const AnexosComponent = ({ anexos = [], onAnexosChange, disabled = false }) => {
  const [loadingAnexo, setLoadingAnexo] = useState(false);

  const adicionarAnexo = async (tipo) => {
    if (disabled) return;

    try {
      setLoadingAnexo(true);

      let result;

      if (tipo === "camera") {
        // Solicitar permissão da câmera
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permissão Negada",
            "É necessário permitir o acesso à câmera para tirar fotos."
          );
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
          base64: true,
        });
      } else if (tipo === "galeria") {
        // Solicitar permissão da galeria
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permissão Negada",
            "É necessário permitir o acesso à galeria para selecionar imagens."
          );
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
          base64: true,
        });
      } else if (tipo === "documento") {
        result = await DocumentPicker.getDocumentAsync({
          type: ["image/*", "application/pdf"],
          copyToCacheDirectory: true,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        let anexoBase64;

        if (tipo === "documento") {
          // Para documentos, precisamos ler o arquivo e converter para base64
          // Por enquanto, vamos aceitar apenas imagens do documento picker
          if (asset.mimeType && asset.mimeType.startsWith("image/")) {
            // Aqui você precisaria implementar a leitura do arquivo
            // Para simplificar, vamos mostrar um alerta
            Alert.alert(
              "Funcionalidade em Desenvolvimento",
              "Seleção de documentos será implementada em breve. Use a câmera ou galeria para imagens."
            );
            return;
          }
        } else {
          // Para imagens da câmera/galeria
          const mimeType = asset.mimeType || "image/jpeg";
          anexoBase64 = `data:${mimeType};base64,${asset.base64}`;
        }

        if (anexoBase64) {
          const novosAnexos = [...anexos, anexoBase64];
          onAnexosChange(novosAnexos);
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar anexo:", error);
      Alert.alert("Erro", "Erro ao adicionar anexo. Tente novamente.");
    } finally {
      setLoadingAnexo(false);
    }
  };

  const removerAnexo = (index) => {
    if (disabled) return;

    Alert.alert("Remover Anexo", "Deseja realmente remover este anexo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const novosAnexos = anexos.filter((_, i) => i !== index);
          onAnexosChange(novosAnexos);
        },
      },
    ]);
  };

  const mostrarOpcoesAnexo = () => {
    if (disabled) return;

    Alert.alert("Adicionar Anexo", "Escolha como deseja adicionar o anexo:", [
      {
        text: "Câmera",
        onPress: () => adicionarAnexo("camera"),
      },
      {
        text: "Galeria",
        onPress: () => adicionarAnexo("galeria"),
      },
      {
        text: "Documento",
        onPress: () => adicionarAnexo("documento"),
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Anexos ({anexos.length})</Text>
        {!disabled && (
          <TouchableOpacity
            style={[styles.addButton, loadingAnexo && styles.addButtonDisabled]}
            onPress={mostrarOpcoesAnexo}
            disabled={loadingAnexo}
          >
            <MaterialIcons
              name="add"
              size={20}
              color={loadingAnexo ? theme.colors.muted : theme.colors.primary}
            />
            <Text
              style={[
                styles.addButtonText,
                loadingAnexo && styles.addButtonTextDisabled,
              ]}
            >
              {loadingAnexo ? "Carregando..." : "Adicionar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {anexos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.anexosContainer}
          contentContainerStyle={styles.anexosContent}
        >
          {anexos.map((anexo, index) => (
            <View key={index} style={styles.anexoItem}>
              <Image source={{ uri: anexo }} style={styles.anexoImage} />
              {!disabled && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removerAnexo(index)}
                >
                  <MaterialIcons name="close" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  titulo: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.muted + "20",
    borderColor: theme.colors.muted,
  },
  addButtonText: {
    ...createTextStyle("caption", "primary"),
    fontWeight: "600",
    marginLeft: 4,
  },
  addButtonTextDisabled: {
    color: theme.colors.muted,
  },
  anexosContainer: {
    marginTop: theme.spacing.sm,
  },
  anexosContent: {
    paddingRight: theme.spacing.md,
  },
  anexoItem: {
    position: "relative",
    marginRight: theme.spacing.sm,
  },
  anexoImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.muted + "40",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: theme.colors.destructive,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AnexosComponent;
