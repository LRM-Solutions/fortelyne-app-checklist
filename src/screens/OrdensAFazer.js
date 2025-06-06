import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";

// Mock data para ordens a fazer
const ordensAFazer = [
  {
    ordem_id: "005",
    ordem_nome_cliente: "Pedro Almeida",
    ordem_endereco: "Rua dos Sonhos, 555 - Bairro Alto",
    ordem_data: "2024-01-16",
    ordem_status: "Pendente",
    ordem_tipo: "Instalação",
    ordem_descricao: "Instalação de chuveiro elétrico e tomadas",
  },
  {
    ordem_id: "006",
    ordem_nome_cliente: "Lucia Ferreira",
    ordem_endereco: "Av. Central, 888 - Centro",
    ordem_data: "2024-01-17",
    ordem_status: "Agendada",
    ordem_tipo: "Manutenção",
    ordem_descricao: "Verificação de disjuntores e fiação",
  },
  {
    ordem_id: "007",
    ordem_nome_cliente: "Roberto Lima",
    ordem_endereco: "Rua Nova, 222 - Jardim América",
    ordem_data: "2024-01-18",
    ordem_status: "Pendente",
    ordem_tipo: "Reparo",
    ordem_descricao: "Reparo urgente em quadro elétrico",
  },
  {
    ordem_id: "008",
    ordem_nome_cliente: "Sandra Ribeiro",
    ordem_endereco: "Rua das Palmeiras, 444 - Vila Bela",
    ordem_data: "2024-01-19",
    ordem_status: "Agendada",
    ordem_tipo: "Instalação",
    ordem_descricao: "Instalação completa de sistema elétrico",
  },
];

const OrdensAFazer = ({ navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pendente":
        return "#FF9800";
      case "Agendada":
        return "#2196F3";
      default:
        return "#666";
    }
  };

  const handleCardPress = (ordem) => {
    // Navegar para tela de formulário (a ser criada)
    navigation.navigate("FormularioOrdem", { ordem });
  };

  const renderOrdemCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item.ordem_id}</Text>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: theme.colors.destructive },
          ]}
        >
          <Text style={styles.statusText}>{item.ordem_status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.clienteName}>{item.ordem_nome_cliente}</Text>
        <Text style={styles.endereco}>{item.ordem_endereco}</Text>
        <Text style={styles.tipo}>{item.ordem_tipo}</Text>
        <Text style={styles.descricao}>{item.ordem_descricao}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.data}>Data prevista: {item.ordem_data}</Text>
        <Text style={styles.tapHint}>Toque para abrir</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens a Fazer</Text>
        <Text style={styles.subtitle}>Serviços pendentes</Text>
      </View>

      <FlatList
        data={ordensAFazer}
        renderItem={renderOrdemCard}
        keyExtractor={(item) => item.ordem_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...createTextStyle("h2", "white"),
    marginBottom: 5,
  },
  subtitle: {
    ...createTextStyle("body", "white"),
    opacity: 0.9,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  orderId: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "bold",
  },
  statusContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  statusText: {
    ...createTextStyle("small", "white"),
    fontWeight: "bold",
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  clienteName: {
    ...createTextStyle("body", "foreground"),
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
  },
  endereco: {
    ...createTextStyle("body", "muted"),
    marginBottom: theme.spacing.sm,
  },
  tipo: {
    ...createTextStyle("body", "primary"),
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  descricao: {
    ...createTextStyle("body", "muted"),
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  data: {
    ...createTextStyle("small", "muted"),
  },
  tapHint: {
    ...createTextStyle("small", "primary"),
    fontWeight: "600",
  },
});

export default OrdensAFazer;
