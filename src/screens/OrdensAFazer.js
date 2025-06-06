import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
            { backgroundColor: getStatusColor(item.ordem_status) },
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#FF9800",
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
    color: "#FF9800",
    fontWeight: "600",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  data: {
    fontSize: 12,
    color: "#999",
  },
  tapHint: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "600",
  },
});

export default OrdensAFazer;
