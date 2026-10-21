import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { Screen, Field, Label, Chips, Button } from "../components/UI";
import { validateChallenge } from "../utils/model.mjs";
export default function EditChallengeScreen({ navigation }) {
  const { skills, saveChallenge } = useApp();
  const [name, setName] = useState("");
  const [metric, setMetric] = useState("sessions");
  const [target, setTarget] = useState("7");
  const [days, setDays] = useState("7");
  const [skillId, setSkill] = useState("");
  const save = () => {
    const input = {
      name: name.trim(),
      metric,
      target: Number(target),
      days: Number(days),
      skillId,
    };
    const err = validateChallenge(input);
    if (err) return Alert.alert("Hedefinizi kontrol edin", err);
    try {
      saveChallenge(input);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Kaydedilemedi", e.message);
    }
  };
  return (
    <Screen
      title="Hedefinizi belirleyin"
      subtitle="Net bir hedef koyun. Size özel olsun."
    >
      <Field
        label="Hedefin adı"
        value={name}
        onChangeText={setName}
        maxLength={80}
        placeholder="Örn. Yedi gün odaklanma"
      />
      <Label> Neyi takip edeceksiniz? </Label>
      <Chips
        items={[
          { value: "sessions", label: "Antrenman" },
          { value: "minutes", label: "Dakika" },
          { value: "successes", label: "Başarılı denemeler" },
        ]}
        value={metric}
        onChange={setMetric}
      />
      <Field
        label="Hedef"
        value={target}
        onChangeText={setTarget}
        keyboardType="number-pad"
      />
      <Field
        label="Süre (1–90 gün)"
        value={days}
        onChangeText={setDays}
        keyboardType="number-pad"
      />
      <Label> Dahil edilecek antrenmanlar </Label>
      <Chips
        items={[
          { value: "", label: "Tüm beceriler" },
          ...skills
            .filter((s) => !s.archived)
            .map((s) => ({ value: s.id, label: s.name })),
        ]}
        value={skillId}
        onChange={setSkill}
      />
      <Button title="Hedef oluştur" onPress={save} />
    </Screen>
  );
}
