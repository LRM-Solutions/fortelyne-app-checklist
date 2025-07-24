import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
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
  const signatureRef = useRef();

  const handleSignature = (signature) => {
    setTempSignature(signature);
  };

  const handleOK = () => {
    if (tempSignature) {
      onSignatureCapture(tempSignature);
      setShowModal(false);
    } else {
      Alert.alert(
        "Atenção",
        "Por favor, faça sua assinatura antes de confirmar."
      );
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setTempSignature(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setTempSignature(null);
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
      left: 20px;
      right: 20px;
      top: 20px;
      bottom: 60px;
    }
    .m-signature-pad--body canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
    }
    .m-signature-pad--footer {
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 20px;
      height: 40px;
    }
    .m-signature-pad--footer .description {
      color: #C3C3C3;
      text-align: center;
      font-size: 12px;
      margin-top: 1.8em;
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
  `;

  return (
    <View style={styles.container}>
      <View style={styles.signatureArea}>
        {value ? (
          <View style={styles.signaturePreview}>
            <Text style={styles.signatureText}>✓ Assinatura capturada</Text>
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
              onEmpty={() => setTempSignature(null)}
              onClear={() => setTempSignature(null)}
              onGetData={() => {}}
              onBegin={() => {}}
              onEnd={() => {}}
              autoClear={false}
              descriptionText=""
              clearText="Limpar"
              confirmText="Confirmar"
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

            <TouchableOpacity style={styles.confirmButton} onPress={handleOK}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    minHeight: 80,
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
  },
  signatureButtonText: {
    ...createTextStyle("body", "muted"),
    fontSize: 16,
  },
  signaturePreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  signatureText: {
    ...createTextStyle("body", "success"),
    fontWeight: "600",
    marginRight: theme.spacing.md,
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
  },
  confirmButtonText: {
    ...createTextStyle("body", "white"),
    textAlign: "center",
    fontWeight: "600",
  },
});

export default AssinaturaComponent;
