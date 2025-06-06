import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdensFeitas from "./OrdensFeitas";
import OrdensAFazer from "./OrdensAFazer";
import PerfilScreen from "./PerfilScreen";
import { View, Text, StyleSheet } from "react-native";

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: styles.tabBar,
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
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
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
