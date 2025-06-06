import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { theme, createTextStyle } from "../utils/theme";

// Mock data para ordens feitas
const ordensFeitas = [
  {
    ordem_id: "001",
    ordem_nome_cliente: "João Silva",
    ordem_endereco: "Rua das Flores, 123 - Centro",
    ordem_data: "2024-01-15",
    ordem_status: "Concluída",
    ordem_tipo: "Instalação",
    ordem_descricao: "Instalação de sistema elétrico residencial",
  },
  {
    ordem_id: "002",
    ordem_nome_cliente: "Maria Santos",
    ordem_endereco: "Av. Principal, 456 - Jardim",
    ordem_data: "2024-01-14",
    ordem_status: "Concluída",
    ordem_tipo: "Manutenção",
    ordem_descricao: "Manutenção preventiva em quadro elétrico",
  },
  {
    ordem_id: "003",
    ordem_nome_cliente: "Carlos Oliveira",
    ordem_endereco: "Rua da Paz, 789 - Vila Nova",
    ordem_data: "2024-01-13",
    ordem_status: "Concluída",
    ordem_tipo: "Reparo",
    ordem_descricao: "Reparo de tomadas e interruptores",
  },
  {
    ordem_id: "004",
    ordem_nome_cliente: "Ana Costa",
    ordem_endereco: "Rua do Comércio, 321 - Centro",
    ordem_data: "2024-01-12",
    ordem_status: "Concluída",
    ordem_tipo: "Instalação",
    ordem_descricao: "Instalação de pontos de energia em escritório",
  },
];

const OrdensFeitas = () => {
  const renderOrdemCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item.ordem_id}</Text>
        <View style={styles.statusContainer}>
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
        <Text style={styles.data}>Data: {item.ordem_data}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens Feitas</Text>
        <Text style={styles.subtitle}>Serviços concluídos</Text>
      </View>

      <FlatList
        data={ordensFeitas}
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
    backgroundColor: theme.colors.success,
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
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  data: {
    ...createTextStyle("small", "muted"),
  },
});

export default OrdensFeitas;
