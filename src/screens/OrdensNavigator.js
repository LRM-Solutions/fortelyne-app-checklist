import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrdensFeitas from "./OrdensFeitas";
import OrdensAFazer from "./OrdensAFazer";
import PerfilScreen from "./PerfilScreen";
import { View, StyleSheet, Platform } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

// Ícones usando @expo/vector-icons
const TabIcon = ({ name, focused }) => {
  const getIcon = () => {
    const color = focused ? "#2196F3" : "#666";
    const size = 24;

    switch (name) {
      case "feitas":
        return <MaterialIcons name="check-circle" size={size} color={color} />;
      case "afazer":
        return (
          <MaterialIcons
            name="radio-button-unchecked"
            size={size}
            color={color}
          />
        );
      case "config":
        return <Ionicons name="person" size={size} color={color} />;
      default:
        return <MaterialIcons name="help" size={size} color={color} />;
    }
  };

  return <View style={styles.tabIcon}>{getIcon()}</View>;
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
});

export default OrdensNavigator;
