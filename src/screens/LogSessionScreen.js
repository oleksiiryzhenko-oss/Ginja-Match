import { formatDay } from "../utils/labels.mjs";
import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { Screen, Field, Label, Chips, Button, Body } from "../components/UI";
import { validateSession } from "../utils/model.mjs";
export default function LogSessionScreen({ route, navigation }) {
  const { skills, sessions, saveSession, removeSession } = useApp();
  const params = route.params || {};
  const old = sessions.find((s) => s.id === params.id);
  const [skillId, setSkill] = useState(
    old?.skillId || params.skillId || skills.find((s) => !s.archived)?.id || "",
  );
  const [attempts, setAttempts] = useState(
    String(old?.attempts ?? params.attempts ?? ""),
  );
  const [successes, setSuccesses] = useState(
    String(old?.successes ?? params.successes ?? ""),
  );
  const [minutes, setMinutes] = useState(
    String(
      old
        ? +(old.seconds / 60).toFixed(2)
        : params.seconds
          ? +(params.seconds / 60).toFixed(2)
          : "",
    ),
  );
  const [effort, setEffort] = useState(old?.effort || "Steady");
  const [notes, setNotes] = useState(old?.notes || "");
  const save = () => {
    const input = {
      id: old?.id,
      skillId,
      attempts: Number(attempts),
      successes: Number(successes),
      seconds: Math.round(Number(minutes.replace(",", ".")) * 60),
      effort,
      notes: notes.trim(),
    };
    if (!skillId)
      return Alert.alert(
        "Bir beceri seçin",
        "Antrenman kaydetmeden önce bir beceri oluşturun.",
      );
    if (!attempts.trim() || !successes.trim())
      return Alert.alert(
        "Eksik sonuçlar",
        "Toplam ve başarılı deneme sayılarını girin.",
      );
    const error = validateSession(input);
    if (error) return Alert.alert("Sonuçlarınızı kontrol edin", error);
    try {
      saveSession(input);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Kaydedilemedi", e.message);
    }
  };
  return (
    <Screen
      title={old ? "Antrenmanı düzenle" : "Antrenmanınızı kaydedin"}
      subtitle={old ? formatDay(old.day) : "Gelişim, doğru bir kayıtla başlar."}
    >
      <Label> Beceri </Label>
      <Chips
        items={skills
          .filter((s) => !s.archived || s.id === skillId)
          .map((s) => ({ value: s.id, label: s.name }))}
        value={skillId}
        onChange={setSkill}
      />
      {!skills.length && (
        <Button
          title="Yeni beceri oluştur"
          onPress={() => navigation.navigate("EditSkill")}
        />
      )}
      <Field
        label="Toplam deneme"
        value={attempts}
        onChangeText={setAttempts}
        keyboardType="number-pad"
      />
      <Field
        label="Başarılı denemeler"
        value={successes}
        onChangeText={setSuccesses}
        keyboardType="number-pad"
      />
      <Field
        label="Süre (dakika)"
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="decimal-pad"
      />
      <Label> Nasıl hissettiniz? </Label>
      <Chips
        items={["Easy", "Steady", "Challenging"]}
        value={effort}
        onChange={setEffort}
      />
      <Field
        label="Antrenman notları"
        value={notes}
        onChangeText={setNotes}
        multiline
        maxLength={2000}
        placeholder="Neler iyi gitti? Bir dahaki sefere ne deneyeceksiniz?"
      />
      <Button title="Antrenmanı kaydet" onPress={save} />
      {old && (
        <Button
          title="Antrenmanı sil"
          danger
          secondary
          onPress={() =>
            Alert.alert(
              "Bu antrenman silinsin mi?",
              "Sonuçları gelişim istatistiklerinden ve hedeflerden kaldırılacak.",
              [
                { text: "İptal", style: "cancel" },
                {
                  text: "Sil",
                  style: "destructive",
                  onPress: () => {
                    try {
                      removeSession(old.id);
                      navigation.goBack();
                    } catch (e) {
                      Alert.alert("Silinemedi", e.message);
                    }
                  },
                },
              ],
            )
          }
        />
      )}
      <Body>
        {" "}
        Kayıtlar bu cihazda saklanır. Firebase veya AppsFlyer'a
        gönderilmez.{" "}
      </Body>
    </Screen>
  );
}
