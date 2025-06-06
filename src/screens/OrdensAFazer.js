import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";
import { getOrdensAFazer } from "../api/ordemApi";
import { useFocusEffect } from "@react-navigation/native";

const OrdensAFazer = ({ navigation }) => {
  const [ordensAFazer, setOrdensAFazer] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarOrdens = async () => {
    setLoading(true);
    try {
      const ordens = await getOrdensAFazer();
      setOrdensAFazer(ordens);
    } catch (error) {
      console.error("Erro ao carregar ordens:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarOrdens();
    }, [])
  );

  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };
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
          <Text style={styles.statusText}>Pendente</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.clienteName}>{item.ordem_nome_cliente}</Text>
        <Text style={styles.endereco}>
          {item.ordem_endereco}
          {item.ordem_cidade && `, ${item.ordem_cidade}`}
          {item.ordem_estado && ` - ${item.ordem_estado}`}
          {item.ordem_cep && ` - ${item.ordem_cep}`}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.data}>Data: {formatarData(item.ordem_data)}</Text>
        <Text style={styles.tapHint}>Toque para abrir</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Não foram encontradas ordens de serviço pendentes
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ordens a Fazer</Text>
          <Text style={styles.subtitle}>Serviços pendentes</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando ordens...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens a Fazer</Text>
        <Text style={styles.subtitle}>Serviços pendentes</Text>
      </View>

      <FlatList
        data={ordensAFazer}
        renderItem={renderOrdemCard}
        keyExtractor={(item) => item.ordem_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...createTextStyle("body", "muted"),
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...createTextStyle("body", "muted"),
    textAlign: "center",
  },
});

export default OrdensAFazer;
