import React from "react";
import { Alert, Share, Linking } from "react-native";
import { useApp } from "../context/AppContext";
import { Screen, Card, Heading, Body, Button } from "../components/UI";
export default function SettingsScreen({ navigation }) {
  const { skills, sessions, challenges, reset } = useApp();
  return (
    <Screen title="Antrenman alanınız" subtitle="Ginja-Match · 1.0.0">
      <Card>
        <Heading> Günlüğünüzü koruyun </Heading>
        <Body>
          {" "}
          Becerileriniz, antrenman notlarınız ve sonuçlarınız bu cihazda
          saklanır. Uygulamayı kaldırırsanız bu veriler silinir. Telefon
          değiştirmeden önce yedeğinizi paylaşın.{" "}
        </Body>
        <Button
          title="Günlük yedeğini paylaş"
          secondary
          onPress={async () => {
            try {
              await Share.share({
                title: "Ginja-Match günlük yedeği",
                message: JSON.stringify(
                  { schema: 1, skills, sessions, challenges },
                  null,
                  2,
                ),
              });
            } catch {
              Alert.alert("Paylaşılamadı", "Lütfen tekrar deneyin.");
            }
          }}
        />
        <Button
          title="Günlüğü geri yükle"
          secondary
          onPress={() => navigation.navigate("Restore")}
        />
      </Card>
      <Body>
        {" "}
        Güvenli antrenman yapın, ısının ve seviyenize uygun egzersizler seçin.
        Bu uygulama bir antrenman günlüğüdür; profesyonel antrenörlük veya tıbbi
        tavsiye yerine geçmez.{" "}
      </Body>
      <Button
        title="Gizlilik politikası"
        secondary
        onPress={() => Linking.openURL("https://kaleidoscopic-longma-f712bf.netlify.app").catch(() => {
          Alert.alert("Bağlantı açılamadı", "Lütfen tekrar deneyin.");
        })}
      />
      <Button
        title="Cihazdaki günlüğü sil"
        danger
        secondary
        onPress={() =>
          Alert.alert(
            "Günlüğünüz silinsin mi?",
            "Bu cihazdaki tüm antrenmanlar ve hedefler silinecek. Başlangıç egzersizleri geri yüklenecek.",
            [
              { text: "İptal", style: "cancel" },
              {
                text: "Sil",
                style: "destructive",
                onPress: async () => {
                  try {
                    await reset();
                  } catch {
                    Alert.alert("Sıfırlanamadı", "Günlüğünüz silinmedi.");
                  }
                },
              },
            ],
          )
        }
      />
    </Screen>
  );
}
