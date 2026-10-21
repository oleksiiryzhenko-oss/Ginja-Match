import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { Screen, Field, Button, Label, Chips } from "../components/UI";
import { validateSkill } from "../utils/model.mjs";
export default function EditSkillScreen({ route, navigation }) {
  const { skills, saveSkill } = useApp();
  const old = skills.find((s) => s.id === route.params?.id);
  const [name, setName] = useState(old?.name || "");
  const [sport, setSport] = useState(old?.sport || "Basketball");
  const [goal, setGoal] = useState(String(old?.goal || 30));
  const [duration, setDuration] = useState(String(old?.duration || 10));
  const [instructions, setInstructions] = useState(old?.instructions || "");
  const save = () => {
    const value = {
      id: old?.id,
      name: name.trim(),
      sport,
      goal: Number(goal),
      duration: Number(duration),
      instructions: instructions.trim(),
    };
    const error = validateSkill(value);
    if (error) return Alert.alert("Becerinizi kontrol edin", error);
    try {
      saveSkill(value);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Kaydedilemedi", e.message);
    }
  };
  return (
    <Screen
      title={old ? "Becerinizi düzenleyin" : "Yeni beceri oluştur"}
      subtitle="Bir sonraki antrenmanınıza net bir amaç belirleyin."
    >
      <Field
        label="Becerinin adı"
        value={name}
        onChangeText={setName}
        maxLength={60}
        placeholder="Örn. Zayıf ayakla şut"
      />
      <Label> Spor dalı </Label>
      <Chips
        items={[
          "Basketball",
          "Football",
          "Tennis",
          "Fitness",
          "Running",
          "Other",
        ]}
        value={sport}
        onChange={setSport}
      />
      <Field
        label="Antrenman başına deneme hedefi"
        value={goal}
        onChangeText={setGoal}
        keyboardType="number-pad"
      />
      <Field
        label="Antrenman süresi (dakika)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="number-pad"
      />
      <Field
        label="Egzersiz açıklaması"
        value={instructions}
        onChangeText={setInstructions}
        multiline
        maxLength={1500}
        placeholder="Nasıl çalışacağınızı ve başarılı denemeleri nasıl sayacağınızı yazın."
      />
      <Button title="Beceriyi kaydet" onPress={save} />
    </Screen>
  );
}
