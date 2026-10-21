import { labelForUi, formatDay } from "../utils/labels.mjs";
import React, { useState } from "react";
import { Plus, Play } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import {
  Screen,
  Card,
  Heading,
  Body,
  Button,
  Chips,
  Field,
  Empty,
} from "../components/UI";
export default function SkillsScreen({ navigation }) {
  const { skills, sessions } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Active");
  const visible = skills.filter(
    (s) =>
      (filter === "Archived" ? s.archived : !s.archived) &&
      `${s.name} ${labelForUi(s.sport)}`
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
  );
  return (
    <Screen
      title="Beceri atölyesi"
      subtitle="Size özel bir antrenman düzeni oluşturun."
      action={
        <Button
          title="Ekle"
          icon={Plus}
          onPress={() => navigation.navigate("EditSkill")}
        />
      }
    >
      <Field
        label="Beceri ara"
        placeholder="Beceri veya spor dalı ara"
        value={query}
        onChangeText={setQuery}
      />
      <Chips
        items={["Active", "Archived"]}
        value={filter}
        onChange={setFilter}
      />
      {visible.map((skill) => (
        <Card key={skill.id}>
          <Body>
            {labelForUi(skill.sport).toLocaleUpperCase("tr-TR")} ·{" "}
            {skill.duration} DK
          </Body>
          <Heading>{skill.name}</Heading>
          <Body>{skill.instructions}</Body>
          <Body>
            {sessions.filter((s) => s.skillId === skill.id).length} antrenman ·
            Hedef: {skill.goal} deneme{" "}
          </Body>
          <Button
            title="Beceriyi gör"
            secondary
            onPress={() => navigation.navigate("SkillDetail", { id: skill.id })}
          />
          {!skill.archived && (
            <Button
              title="Bu beceriyi çalış"
              icon={Play}
              onPress={() =>
                navigation.navigate("Training", { skillId: skill.id })
              }
            />
          )}
        </Card>
      ))}
      {!visible.length && (
        <Empty
          title="Yeni bir beceriye yer açın"
          text="Tekrarlarınızı takip etmeye başlamak için bir egzersiz oluşturun."
          action={
            <Button
              title="Beceri oluştur"
              onPress={() => navigation.navigate("EditSkill")}
            />
          }
        />
      )}
    </Screen>
  );
}
