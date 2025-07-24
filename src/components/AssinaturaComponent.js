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
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

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
      width: 100%;
      height: 100%;
      border: 1px solid #e8e8e8;
      background-color: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
      border-radius: 4px;
    }
    .m-signature-pad--body {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 20px;
    }
    .m-signature-pad--body canvas {
      position: absolute;
      left: 20px;
      top: 20px;
      right: 20px;
      bottom: 20px;
      width: calc(100% - 40px);
      height: calc(100% - 40px);
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
    <View style={styles.container}>
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
            <Text style={styles.signatureButtonText}>
              📝 Toque para assinar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
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
                width: screenWidth - 40,
                height: 300,
              }}
            />
            {!hasDrawn && (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                  ✍️ Desenhe sua assinatura aqui
                </Text>
              </View>
            )}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !hasDrawn && styles.confirmButtonDisabled,
              ]}
              onPress={handleOK}
              disabled={!hasDrawn}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  !hasDrawn && styles.confirmButtonTextDisabled,
                ]}
              >
                {hasDrawn ? "Confirmar" : "Confirmar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
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
    height: 60,
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
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: theme.borderRadius.md,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "relative",
  },
  placeholderContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
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
    paddingVertical: 20,
    backgroundColor: theme.colors.card,
  },
  clearButton: {
    ...createButtonStyle("secondary"),
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  clearButtonText: {
    ...createTextStyle("body", "foreground"),
    textAlign: "center",
    fontWeight: "600",
  },
  cancelButton: {
    ...createButtonStyle("ghost"),
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  cancelButtonText: {
    ...createTextStyle("body", "foreground"),
    textAlign: "center",
    fontWeight: "600",
  },
  confirmButton: {
    ...createButtonStyle("default"),
    flex: 1,
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.muted,
    opacity: 0.6,
  },
  confirmButtonText: {
    ...createTextStyle("body", "white"),
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  confirmButtonTextDisabled: {
    color: theme.colors.mutedForeground,
  },
});

export default AssinaturaComponent;
