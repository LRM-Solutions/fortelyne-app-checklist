import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdensFeitas from "./OrdensFeitas";
import OrdensAFazer from "./OrdensAFazer";
import PerfilScreen from "./PerfilScreen";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

// Ícones simples usando texto
const TabIcon = ({ name, focused }) => {
  const getIconText = () => {
    switch (name) {
      case "feitas":
        return "✓";
      case "afazer":
        return "○";
      case "config":
        return "👤";
      default:
        return "?";
    }
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.iconText, { color: focused ? "#2196F3" : "#666" }]}>
        {getIconText()}
      </Text>
    </View>
  );
};

const OrdensNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarActiveTintColor: "#2196F3",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: [
            styles.tabBar,
            {
              paddingBottom: Platform.OS === "android" ? insets.bottom + 5 : 5,
              height: Platform.OS === "android" ? 60 + insets.bottom : 60,
            },
          ],
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="afazer"
          component={OrdensAFazer}
          options={{
            tabBarLabel: "A Fazer",
          }}
        />
        <Tab.Screen
          name="feitas"
          component={OrdensFeitas}
          options={{
            tabBarLabel: "Feitas",
          }}
        />
        <Tab.Screen
          name="config"
          component={PerfilScreen}
          options={{
            tabBarLabel: "Perfil",
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OrdensNavigator;
