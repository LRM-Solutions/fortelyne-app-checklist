import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { theme, createTextStyle, createButtonStyle } from "../utils/theme";
import {
  getOrdensAFazer,
  verificarLocalizacaoFuncionario,
} from "../api/ordemApi";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

const OrdensAFazer = ({ navigation }) => {
  const [ordensAFazer, setOrdensAFazer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificandoLocalizacao, setVerificandoLocalizacao] = useState(false);

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

  const obterLocalizacaoAtual = async () => {
    try {
      // Verificar permissão
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "É necessário permitir o acesso à localização para verificar se você está no local da ordem."
        );
        return null;
      }

      // Obter localização atual
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert(
        "Erro de Localização",
        "Não foi possível obter sua localização atual. Verifique se o GPS está ativado."
      );
      return null;
    }
  };

  const handleCardPress = async (ordem) => {
    setVerificandoLocalizacao(true);

    try {
      // Obter localização atual do funcionário
      const localizacao = await obterLocalizacaoAtual();

      if (!localizacao) {
        setVerificandoLocalizacao(false);
        return;
      }

      // Verificar se o funcionário está no range da ordem
      const dentroDaArea = await verificarLocalizacaoFuncionario(
        ordem.ordem_id,
        localizacao.latitude,
        localizacao.longitude
      );

      if (dentroDaArea) {
        // Funcionário está no range, navegar para o formulário
        navigation.navigate("FormularioOrdem", { ordem });
      } else {
        // Funcionário não está no range
        Alert.alert(
          "Localização Incorreta",
          "Você não está na localização da ordem de serviço. Aproxime-se do local indicado para continuar.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Erro na verificação de localização:", error);
      Alert.alert("Erro", "Erro ao verificar localização. Tente novamente.");
    } finally {
      setVerificandoLocalizacao(false);
    }
  };

  const renderOrdemCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, verificandoLocalizacao && styles.cardDisabled]}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.7}
      disabled={verificandoLocalizacao}
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
        {verificandoLocalizacao ? (
          <View style={styles.loadingLocationContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingLocationText}>Verificando...</Text>
          </View>
        ) : (
          <Text style={styles.tapHint}>Toque para abrir</Text>
        )}
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
  cardDisabled: {
    opacity: 0.7,
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
  loadingLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingLocationText: {
    ...createTextStyle("small", "primary"),
    marginLeft: theme.spacing.xs,
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
