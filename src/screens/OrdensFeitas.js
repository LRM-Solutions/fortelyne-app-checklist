import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 16,
  },
  clienteName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  endereco: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tipo: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  data: {
    fontSize: 12,
    color: "#999",
  },
});

export default OrdensFeitas;
