import { labelForUi, formatDay } from "../utils/labels.mjs";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { useApp } from "../context/AppContext";
import {
  Screen,
  Card,
  Heading,
  Body,
  Chips,
  Row,
  Metric,
  Button,
  Empty,
} from "../components/UI";
import { aggregate, percentage, dayKey } from "../utils/model.mjs";
import colors from "../utils/colors";
export default function ProgressScreen({ navigation }) {
  const { sessions, skills } = useApp();
  const [period, setPeriod] = useState("7 days");
  const [skill, setSkill] = useState("");
  const since = new Date();
  since.setDate(since.getDate() - (period === "7 days" ? 6 : 29));
  const records = sessions.filter(
    (s) =>
      (period === "All time" || s.day >= dayKey(since)) &&
      (!skill || s.skillId === skill),
  );
  const totals = aggregate(records);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return {
      key: dayKey(d),
      label: d.toLocaleDateString("tr-TR", { weekday: "narrow" }),
      count: records.filter((s) => s.day === dayKey(d)).length,
    };
  });
  const max = Math.max(1, ...days.map((d) => d.count));
  const best = records.reduce(
    (b, s) => Math.max(b, percentage(s.successes, s.attempts)),
    0,
  );
  return (
    <Screen
      title="Gelişiminizi görün"
      subtitle="Emeğinizi ve gelişiminizi net bir şekilde görün."
    >
      <Chips
        items={["7 days", "30 days", "All time"]}
        value={period}
        onChange={setPeriod}
      />
      <Chips
        items={[
          { value: "", label: "Tüm beceriler" },
          ...skills.map((s) => ({ value: s.id, label: s.name })),
        ]}
        value={skill}
        onChange={setSkill}
      />
      <Row>
        <Metric value={totals.sessions} label="ANTRENMAN" />
        <Metric value={Math.round(totals.minutes)} label="DAKİKA" />
      </Row>
      <Row>
        <Metric
          value={`${percentage(totals.successes, totals.attempts)}%`}
          label="İSABET ORANI"
        />
        <Metric value={`${best}%`} label="EN İYİ ANTRENMAN" />
      </Row>
      <Card>
        <Heading> Son yedi gün </Heading>
        <View
          style={{
            height: 120,
            flexDirection: "row",
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          {days.map((d) => (
            <View key={d.key} style={{ flex: 1, alignItems: "center", gap: 8 }}>
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                {d.count}
              </Text>
              <View
                style={{
                  height: Math.max(3, (d.count / max) * 70),
                  width: "100%",
                  borderRadius: 5,
                  backgroundColor: d.count ? colors.primary : colors.border,
                }}
              />
              <Body>{d.label}</Body>
            </View>
          ))}
        </View>
      </Card>
      <Heading> Antrenman günlüğü </Heading>
      {records.map((s) => (
        <Card key={s.id}>
          <Body>
            {formatDay(s.day)} · {labelForUi(s.effort)}
          </Body>
          <Heading>
            {skills.find((v) => v.id === s.skillId)?.name || "Beceri"}
          </Heading>
          <Body>
            {s.successes}/{s.attempts} başarılı ·{" "}
            {(s.seconds / 60).toLocaleString("tr-TR", {
              maximumFractionDigits: 1,
            })}{" "}
            dk
          </Body>
          {!!s.notes && <Body>{s.notes}</Body>}
          <Button
            title="İncele ve düzenle"
            secondary
            onPress={() => navigation.navigate("LogSession", { id: s.id })}
          />
        </Card>
      ))}
      {!records.length && (
        <Empty
          title="Gelişiminiz burada başlayacak"
          text="Antrenman geçmişinizi oluşturmak için ilk kaydınızı ekleyin."
          action={
            <Button
              title="Antrenman kaydet"
              onPress={() => navigation.navigate("LogSession")}
            />
          }
        />
      )}
    </Screen>
  );
}
