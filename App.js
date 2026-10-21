import React from "react";
import { StatusBar, View, Text } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  House,
  Crosshair,
  Flag,
  ChartNoAxesCombined,
} from "lucide-react-native";
import { AppProvider, useApp } from "./src/context/AppContext";
import colors from "./src/utils/colors";
import { Button } from "./src/components/UI";
import PreviewScreen from "./src/screens/PreviewScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import SkillsScreen from "./src/screens/SkillsScreen";
import SkillDetailScreen from "./src/screens/SkillDetailScreen";
import EditSkillScreen from "./src/screens/EditSkillScreen";
import TrainingScreen from "./src/screens/TrainingScreen";
import LogSessionScreen from "./src/screens/LogSessionScreen";
import ChallengesScreen from "./src/screens/ChallengesScreen";
import EditChallengeScreen from "./src/screens/EditChallengeScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import RestoreScreen from "./src/screens/RestoreScreen";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => {
          const Icon = {
            Today: House,
            Skills: Crosshair,
            ChallengesTab: Flag,
            ProgressTab: ChartNoAxesCombined,
          }[route.name];
          return <Icon color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={DashboardScreen}
        options={{ title: "Bugün" }}
      />
      <Tab.Screen
        name="Skills"
        component={SkillsScreen}
        options={{ title: "Beceriler" }}
      />
      <Tab.Screen
        name="ChallengesTab"
        component={ChallengesScreen}
        options={{ title: "Hedefler" }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{ title: "Gelişim" }}
      />
    </Tab.Navigator>
  );
}
function Root() {
  const { storageError, retrySave } = useApp();
  return (
    <>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Preview"
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.primary,
            headerTitle: "",
            headerShadowVisible: false,
            cardStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Preview"
            component={PreviewScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Home"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="SkillDetail" component={SkillDetailScreen} />
          <Stack.Screen name="EditSkill" component={EditSkillScreen} />
          <Stack.Screen name="Training" component={TrainingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LogSession" component={LogSessionScreen} />
          <Stack.Screen name="EditChallenge" component={EditChallengeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Restore" component={RestoreScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {!!storageError && (
        <View style={{ padding: 16, backgroundColor: colors.elevated, gap: 8 }}>
          <Text style={{ color: colors.text }}>{storageError}</Text>
          <Button
            title="Kaydetmeyi tekrar dene"
            secondary
            onPress={retrySave}
          />
        </View>
      )}
    </>
  );
}
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
        <AppProvider>
          <Root />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
