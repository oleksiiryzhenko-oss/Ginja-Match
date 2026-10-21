import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import * as Updates from "expo-updates";
import { useApp } from "../context/AppContext";
import { Progress } from "../components/UI";
import colors from "../utils/colors";

const MIN_DURATION = 6000;
const bounded = (task, delay) => new Promise((resolve) => {
  const timer = setTimeout(() => resolve(null), delay);
  Promise.resolve(task).then((value) => {
    clearTimeout(timer);
    resolve(value);
  }, () => {
    clearTimeout(timer);
    resolve(null);
  });
});

export default function PreviewScreen({ navigation }) {
  const { ready } = useApp();
  const [progress, setProgress] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [updatesReady, setUpdatesReady] = useState(false);
  const [message, setMessage] = useState("Güncellemeler kontrol ediliyor…");
  const navigated = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setProgress(Math.min(90, ((Date.now() - startedAt) / MIN_DURATION) * 90));
    }, 100);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setTimeUp(true);
    }, MIN_DURATION);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkUpdates = async () => {
      try {
        if (!__DEV__ && Updates.isEnabled) {
          const result = await bounded(Updates.checkForUpdateAsync(), 10000);
          if (cancelled) return;
          if (result?.isAvailable) {
            setMessage("Yeni sürüm indiriliyor…");
            const fetched = await bounded(Updates.fetchUpdateAsync(), 20000);
            if (cancelled) return;
            if (fetched?.isNew) {
              setProgress(100);
              setMessage("Uygulama güncelleniyor…");
              await Updates.reloadAsync();
              return;
            }
          }
        }
      } catch {} finally {
        if (!cancelled) {
          setUpdatesReady(true);
          setMessage("Antrenman alanınız hazırlanıyor");
        }
      }
    };
    checkUpdates();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!timeUp || !ready || !updatesReady || navigated.current) return;
    navigated.current = true;
    navigation.replace("Home");
  }, [timeUp, ready, updatesReady, navigation]);

  return (
    <View style={styles.screen}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>GINJA-MATCH</Text>
      <View style={styles.progress}><Progress value={progress} /></View>
      <ActivityIndicator color={colors.primary} />
      <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 28,
    gap: 24,
  },
  logo: { width: 150, height: 150, borderRadius: 30 },
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 2,
  },
  progress: { width: "80%", maxWidth: 320 },
  message: { color: colors.muted, textAlign: "center", lineHeight: 22 },
});
