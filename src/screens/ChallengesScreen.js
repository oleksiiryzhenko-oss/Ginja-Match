import { labelForUi, formatDay } from "../utils/labels.mjs";
import React from "react";
import { Alert } from "react-native";
import { Plus } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import {
  Screen,
  Card,
  Heading,
  Body,
  Button,
  Progress,
  Empty,
} from "../components/UI";
import { challengeProgress, dayKey } from "../utils/model.mjs";
export default function ChallengesScreen({ navigation }) {
  const { challenges, sessions, skills, removeChallenge } = useApp();
  return (
    <Screen
      title="Kendinizi aşın"
      subtitle="Sizin hedefiniz. Sizin başarınız."
      action={
        <Button
          title="Yeni"
          icon={Plus}
          onPress={() => navigation.navigate("EditChallenge")}
        />
      }
    >
      {challenges.map((c) => {
        const p = challengeProgress(c, sessions);
        return (
          <Card key={c.id}>
            <Body>
              {p.complete
                ? "TAMAMLANDI ✦"
                : c.endDay < dayKey()
                  ? "SÜRESİ DOLDU"
                  : "DEVAM EDİYOR"}{" "}
              · SON TARİH {formatDay(c.endDay)}
            </Body>
            <Heading>{c.name}</Heading>
            <Body>
              {skills.find((s) => s.id === c.skillId)?.name || "Tüm beceriler"}
            </Body>
            <Progress value={p.percent} />
            <Heading>
              {p.value} / {c.target} {labelForUi(c.metric)}
            </Heading>
            <Button
              title="Hedefi kaldır"
              secondary
              onPress={() =>
                Alert.alert(
                  "Bu hedef kaldırılsın mı?",
                  "Antrenman kayıtlarınız günlükte kalacak.",
                  [
                    { text: "İptal", style: "cancel" },
                    {
                      text: "Kaldır",
                      style: "destructive",
                      onPress: () => {
                        try {
                          removeChallenge(c.id);
                        } catch (e) {
                          Alert.alert("Kaldırılamadı", e.message);
                        }
                      },
                    },
                  ],
                )
              }
            />
          </Card>
        );
      })}
      {!challenges.length && (
        <Empty
          title="Kendinize bir hedef belirleyin"
          text="Yedi günde yedi antrenman, 100 isabetli pas veya bir saatlik odaklı çalışma hedefleyin."
          action={
            <Button
              title="Yeni hedef oluştur"
              onPress={() => navigation.navigate("EditChallenge")}
            />
          }
        />
      )}
    </Screen>
  );
}
