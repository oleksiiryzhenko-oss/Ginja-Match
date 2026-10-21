import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, Text, View } from "react-native";
import { Play, Pause, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useApp } from "../context/AppContext";
import {
  Screen,
  Card,
  Heading,
  Body,
  Button,
  Row,
  Metric,
  Progress,
} from "../components/UI";
import colors from "../utils/colors";
export default function TrainingScreen({ route, navigation }) {
  const { skills } = useApp();
  const skill = skills.find((s) => s.id === route.params.skillId);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const elapsed = useRef(0);
  const started = useRef(null);
  const finished = useRef(false);
  const attemptsRef = useRef(0);
  const current = () =>
    elapsed.current +
    (started.current === null ? 0 : Date.now() - started.current);
  const sync = () => setSeconds(Math.floor(current() / 1000));
  useEffect(() => {
    const id = setInterval(sync, 250);
    const sub = AppState.addEventListener("change", sync);
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (finished.current || (!attemptsRef.current && current() < 1000))
          return;
        e.preventDefault();
        Alert.alert(
          "Antrenmandan çıkılsın mı?",
          "Kaydedilmemiş denemeler ve süre silinecek.",
          [
            { text: "Antrenmana devam et", style: "cancel" },
            {
              text: "Vazgeç",
              style: "destructive",
              onPress: () => {
                finished.current = true;
                navigation.dispatch(e.data.action);
              },
            },
          ],
        );
      }),
    [navigation],
  );
  if (!skill) return <Screen title="Beceri bulunamadı" onBack={() => navigation.goBack()} />;
  const toggle = () => {
    if (started.current !== null) {
      elapsed.current = current();
      started.current = null;
      setRunning(false);
    } else {
      started.current = Date.now();
      setRunning(true);
    }
    sync();
  };
  const record = (made) => {
    setAttempts((v) => v + 1);
    attemptsRef.current++;
    if (made) setSuccesses((v) => v + 1);
    Haptics.selectionAsync().catch(() => {});
  };
  const finish = () => {
    if (started.current !== null) {
      elapsed.current = current();
      started.current = null;
    }
    setRunning(false);
    finished.current = true;
    navigation.replace("LogSession", {
      skillId: skill.id,
      attempts,
      successes,
      seconds: Math.max(1, Math.floor(current() / 1000)),
    });
  };
  return (
    <Screen title="Odaklı antrenman" subtitle={skill.name} onBack={() => navigation.goBack()}>
      <Card>
        <Body>{skill.instructions}</Body>
      </Card>
      <Card style={{ alignItems: "center", paddingVertical: 30 }}>
        <Body>
          {running ? "KENDİ RİTMİNİZDE" : "HAZIR OLDUĞUNUZDA BAŞLAYIN"}
        </Body>
        <Text
          style={{
            fontSize: 64,
            color: colors.primary,
            fontWeight: "200",
            fontVariant: ["tabular-nums"],
          }}
        >
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </Text>
        <Body> Planlanan süre: {skill.duration} dakika </Body>
        <View style={{ alignSelf: "stretch" }}>
          <Progress value={(seconds / (skill.duration * 60)) * 100} />
        </View>
        <Button
          title={running ? "Kronometreyi duraklat" : "Kronometreyi başlat"}
          icon={running ? Pause : Play}
          onPress={toggle}
        />
      </Card>
      <Row>
        <Metric value={attempts} label={`DENEME / ${skill.goal}`} />
        <Metric value={successes} label="BAŞARILI" />
      </Row>
      <Row>
        <Button
          title="Başarılı"
          icon={Check}
          style={{ flex: 1 }}
          onPress={() => record(true)}
        />
        <Button
          title="Başarısız"
          secondary
          style={{ flex: 1 }}
          onPress={() => record(false)}
        />
      </Row>
      <Button
        title="Bir denemeyi geri al"
        secondary
        disabled={!attempts}
        onPress={() => {
          Alert.alert(
            "Denemeyi geri al",
            "Hangi sonucu kaldırmak istiyorsunuz?",
            [
              { text: "İptal", style: "cancel" },
              ...(successes > 0
                ? [
                    {
                      text: "Başarılı",
                      onPress: () => {
                        setAttempts((v) => v - 1);
                        attemptsRef.current--;
                        setSuccesses((v) => v - 1);
                      },
                    },
                  ]
                : []),
              ...(attempts > successes
                ? [
                    {
                      text: "Başarısız",
                      onPress: () => {
                        setAttempts((v) => v - 1);
                        attemptsRef.current--;
                      },
                    },
                  ]
                : []),
            ],
          );
        }}
      />
      <Button title="Bitir ve gözden geçir" onPress={finish} />
      <Body>
        {" "}
        Uygulamadan kısa süreliğine ayrılsanız da kronometre süreyi doğru tutar.
        Kaydedene kadar bu antrenmanı açık tutun.{" "}
      </Body>
    </Screen>
  );
}
