import React, { useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { Screen, Field, Button, Body } from "../components/UI";
import { isState } from "../utils/model.mjs";
export default function RestoreScreen({ navigation }) {
  const [value, setValue] = useState("");
  const { restore } = useApp();
  const apply = () => {
    let data;
    try {
      data = JSON.parse(value);
      if (!isState(data)) throw new Error();
    } catch {
      return Alert.alert(
        "Geçersiz yedek",
        "Ginja-Match günlük yedeğinin JSON içeriğini eksiksiz yapıştırın.",
      );
    }
    Alert.alert(
      "Cihazdaki günlük değiştirilsin mi?",
      "Bu cihazdaki mevcut beceriler, antrenmanlar ve hedefler değiştirilecek.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Geri yükle",
          onPress: async () => {
            try {
              await restore(data);
              navigation.goBack();
            } catch {
              Alert.alert(
                "Geri yükleme başarısız",
                "Yedek kaydedilemedi. Lütfen tekrar deneyin.",
              );
            }
          },
        },
      ],
    );
  };
  return (
    <Screen title="Günlüğünüzü geri yükleyin">
      <Body>
        {" "}
        Daha önce paylaştığınız Ginja-Match yedeğini yapıştırın. Mevcut
        günlüğünüz yalnızca onayınızdan sonra değiştirilecek.{" "}
      </Body>
      <Field
        label="Günlük yedeği (JSON)"
        multiline
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        title="Doğrula ve geri yükle"
        onPress={apply}
        disabled={!value.trim()}
      />
    </Screen>
  );
}
