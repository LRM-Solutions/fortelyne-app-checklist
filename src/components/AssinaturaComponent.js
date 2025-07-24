import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AssinaturaComponent = ({
  onSignatureCapture,
  value,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempSignature, setTempSignature] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const signatureRef = useRef();

  const handleSignature = (signature) => {
    setTempSignature(signature);
  };

  const handleBegin = () => {
    setHasDrawn(true);
  };

  const handleEmpty = () => {
    setTempSignature(null);
    setHasDrawn(false);
  };

  const handleOK = () => {
    if (hasDrawn && signatureRef.current) {
      // Trigger signature capture from the canvas
      signatureRef.current.readSignature();
    } else {
      Alert.alert(
        "Atenção",
        "Por favor, faça sua assinatura antes de confirmar."
      );
    }
  };

  const handleConfirmSignature = () => {
    if (tempSignature) {
      onSignatureCapture(tempSignature);
      setShowModal(false);
      setTempSignature(null);
      setHasDrawn(false);
    }
  };

  // Automatically confirm when signature is captured
  React.useEffect(() => {
    if (tempSignature && hasDrawn) {
      handleConfirmSignature();
    }
  }, [tempSignature]);

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setTempSignature(null);
    setHasDrawn(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setTempSignature(null);
    setHasDrawn(false);
  };

  const handleRemoveSignature = () => {
    Alert.alert(
      "Remover Assinatura",
      "Deseja realmente remover a assinatura?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => onSignatureCapture(null),
        },
      ]
    );
  };

  const webStyle = `
    .m-signature-pad {
      position: relative;
      font-size: 10px;
      width: 320px;
      height: 200px;
      margin: 0 auto;
      border: 1px solid #e8e8e8;
      background-color: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
      border-radius: 4px;
      display: block;
    }
    .m-signature-pad--body {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 15px;
    }
    .m-signature-pad--body canvas {
      position: absolute;
      left: 15px;
      top: 15px;
      right: 15px;
      bottom: 15px;
      width: calc(100% - 30px);
      height: calc(100% - 30px);
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
    }
    .m-signature-pad--footer {
      display: none !important;
    }
    .m-signature-pad--footer .description {
      display: none !important;
    }
    .signature-pad-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ccc;
      font-size: 14px;
      pointer-events: none;
      z-index: 1;
    }
    /* Hide internal buttons */
    .signature-pad-buttons {
      display: none !important;
    }
    button {
      display: none !important;
    }
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signatureArea}>
        {value ? (
          <View style={styles.signaturePreview}>
            <View style={styles.previewHeader}>
              <Text style={styles.signatureText}>✓ Assinatura capturada</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setShowModal(true)}
                  disabled={disabled}
                >
                  <Text style={styles.changeButtonText}>Alterar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveSignature}
                  disabled={disabled}
                >
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.signatureImageContainer}>
              <Image
                source={{ uri: value }}
                style={styles.signatureImage}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.signatureButton}
            onPress={() => setShowModal(true)}
            disabled={disabled}
          >
            <Text style={styles.signatureButtonText}>Toque para assinar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Área de Assinatura</Text>
              <Text style={styles.modalSubtitle}>
                Faça sua assinatura na área abaixo
              </Text>
            </View>

            <View style={styles.signatureContainer}>
              <SignatureCanvas
                ref={signatureRef}
                onOK={handleSignature}
                onEmpty={handleEmpty}
                onClear={handleEmpty}
                onGetData={() => {}}
                onBegin={handleBegin}
                onEnd={() => {}}
                autoClear={false}
                descriptionText=""
                clearText=""
                confirmText=""
                webStyle={webStyle}
                imageType="image/png"
                dataURL=""
                penColor="black"
                backgroundColor="white"
                dotSize={2}
                minWidth={1}
                canvasProps={{
                  width: 320,
                  height: 200,
                }}
              />
              {!hasDrawn && (
                <View style={styles.placeholderContainer}>
                  <Feather name="edit-3" size={28} color="#ccc" />
                  <Text style={styles.placeholderText}>
                    Desenhe sua assinatura aqui
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <MaterialIcons name="delete-outline" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !hasDrawn && styles.confirmButtonDisabled,
                ]}
                onPress={handleOK}
                disabled={!hasDrawn}
              >
                <MaterialIcons
                  name="check"
                  size={24}
                  color={!hasDrawn ? "#9ca3af" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    flex: 1,
  },
  signatureArea: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderStyle: "dashed",
    backgroundColor: theme.colors.card,
  },
  signatureButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    minHeight: 120,
  },
  signatureButtonText: {
    ...createTextStyle("body", "muted"),
    fontSize: 16,
  },
  signaturePreview: {
    flex: 1,
    padding: theme.spacing.md,
    height: 300,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  signatureText: {
    ...createTextStyle("body", "success"),
    fontWeight: "600",
    flex: 1,
  },
  signatureImageContainer: {
    height: 210,
    backgroundColor: "white",
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs,
  },
  signatureImage: {
    width: "100%",
    height: "100%",
  },
  changeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  changeButtonText: {
    ...createTextStyle("body", "white"),
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: theme.colors.destructive,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  removeButtonText: {
    ...createTextStyle("body", "white"),
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    maxWidth: 400,
    width: "100%",
    height: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    ...createTextStyle("h2", "white"),
    marginBottom: 5,
  },
  modalSubtitle: {
    ...createTextStyle("body", "white"),
    opacity: 0.9,
  },
  signatureContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "relative",
    height: 260,
    overflow: "hidden",
  },
  placeholderContainer: {
    position: "absolute",
    width: 320,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",

    zIndex: 1,
  },
  placeholderText: {
    ...createTextStyle("body", "muted"),
    fontSize: 16,
    opacity: 0.6,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
  },
  clearButton: {
    ...createButtonStyle("secondary"),
    flex: 1,
    backgroundColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#16a34a",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.muted,
    opacity: 0.6,
  },
});

export default AssinaturaComponent;
