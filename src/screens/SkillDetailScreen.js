import { labelForUi, formatDay } from "../utils/labels.mjs";
import React from "react";
import { Alert } from "react-native";
import { useApp } from "../context/AppContext";
import {
  Screen,
  Card,
  Heading,
  Body,
  Button,
  Metric,
  Row,
  Empty,
} from "../components/UI";
import { aggregate, percentage } from "../utils/model.mjs";
export default function SkillDetailScreen({ route, navigation }) {
  const { skills, sessions, archiveSkill } = useApp();
  const skill = skills.find((s) => s.id === route.params.id);
  if (!skill) return <Screen title="Beceri bulunamadı" />;
  const records = sessions.filter((s) => s.skillId === skill.id);
  const total = aggregate(records);
  return (
    <Screen
      title={skill.name}
      subtitle={`${labelForUi(skill.sport)} · ${skill.duration} dk antrenman`}
    >
      <Card>
        <Heading> Antrenman planınız </Heading>
        <Body>
          {skill.instructions || "Henüz egzersiz açıklaması eklenmedi."}
        </Body>
        <Body> Hedef: {skill.goal} deneme / antrenman </Body>
      </Card>
      <Row>
        <Metric value={records.length} label="ANTRENMAN" />
        <Metric
          value={`${percentage(total.successes, total.attempts)}%`}
          label="GENEL İSABET"
        />
      </Row>
      {!skill.archived && (
        <Button
          title="Antrenmana başla"
          onPress={() => navigation.navigate("Training", { skillId: skill.id })}
        />
      )}
      <Button
        title="Beceriyi düzenle"
        secondary
        onPress={() => navigation.navigate("EditSkill", { id: skill.id })}
      />
      <Button
        title={
          skill.archived ? "Beceriyi yeniden etkinleştir" : "Beceriyi arşivle"
        }
        secondary
        onPress={() => {
          try {
            archiveSkill(skill.id);
          } catch (e) {
            Alert.alert("Güncellenemedi", e.message);
          }
        }}
      />
      <Heading> Son antrenmanlar </Heading>
      {records.slice(0, 10).map((s) => (
        <Card key={s.id}>
          <Body>{formatDay(s.day)}</Body>
          <Heading>
            {s.successes} / {s.attempts} başarılı{" "}
          </Heading>
          <Body>{s.notes || "Bir antrenman daha tamamlandı."}</Body>
          <Button
            title="Kaydı düzenle"
            secondary
            onPress={() => navigation.navigate("LogSession", { id: s.id })}
          />
        </Card>
      ))}
      {!records.length && (
        <Empty
          title="İlk tekrarınız sizi bekliyor"
          text="Bir antrenman başlatın veya tamamladığınız bir antrenmanı kaydedin."
          action={
            <Button
              title="Antrenman kaydet"
              onPress={() =>
                navigation.navigate("LogSession", { skillId: skill.id })
              }
            />
          }
        />
      )}
    </Screen>
  );
}
