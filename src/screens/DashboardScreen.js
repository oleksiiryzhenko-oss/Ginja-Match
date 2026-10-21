import { labelForUi, formatDay } from "../utils/labels.mjs";
import React from "react";
import { Text, View } from "react-native";
import { Play, Plus, Settings, ArrowUpRight } from "lucide-react-native";
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
import {
  aggregate,
  dayKey,
  streak,
  challengeProgress,
  percentage,
} from "../utils/model.mjs";
import colors from "../utils/colors";
export default function DashboardScreen({ navigation }) {
  const { sessions, skills, challenges } = useApp();
  const today = aggregate(sessions.filter((s) => s.day === dayKey()));
  const total = aggregate(sessions);
  const next = skills.find((s) => !s.archived);
  const challenge = challenges.find(
    (c) => !challengeProgress(c, sessions).complete && c.endDay >= dayKey(),
  );
  return (
    <Screen
      title="Her antrenman değerli."
      subtitle="Küçük tekrarlar. Kalıcı gelişim."
      action={
        <Button
          title=""
          accessibilityLabel="Ayarlar"
          icon={Settings}
          secondary
          onPress={() => navigation.navigate("Settings")}
        />
      }
    >
      <Card style={{ backgroundColor: colors.surface, paddingVertical: 26 }}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: "700",
          }}
        >
          {" "}
          GÜNLÜK HEDEFİNİZ{" "}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 27,
            fontWeight: "800",
            lineHeight: 34,
          }}
        >
          {"Tek bir beceri.\nHer gün biraz daha iyi."}
        </Text>
        <Body>
          {" "}
          Bir egzersiz seçin, kronometreyi başlatın ve sonuçlarınızı
          kaydedin.{" "}
        </Body>
        <Button
          title={next ? "Odaklı antrenmana başla" : "İlk becerinizi oluşturun"}
          icon={Play}
          onPress={() =>
            next
              ? navigation.navigate("Training", { skillId: next.id })
              : navigation.navigate("EditSkill")
          }
        />
      </Card>
      <Row>
        <Metric value={today.sessions} label="BUGÜNKÜ ANTRENMAN" />
        <Metric value={streak(sessions)} label="GÜNLÜK SERİ" />
      </Row>
      <Heading> Antrenman özetiniz </Heading>
      <Card>
        <Row>
          <Metric small value={total.sessions} label="ANTRENMAN" />
          <Metric
            small
            value={`${percentage(total.successes, total.attempts)}%`}
            label="İSABET ORANI"
          />
          <Metric small value={Math.round(total.minutes)} label="DAKİKA" />
        </Row>
        <Button
          secondary
          title="Gelişiminizi inceleyin"
          icon={ArrowUpRight}
          onPress={() => navigation.navigate("ProgressTab")}
        />
      </Card>
      {challenge && (
        <Card>
          <Body> AKTİF HEDEF </Body>
          <Heading>{challenge.name}</Heading>
          <Progress value={challengeProgress(challenge, sessions).percent} />
          <Body>
            {challengeProgress(challenge, sessions).value} / {challenge.target}{" "}
            {labelForUi(challenge.metric)}
          </Body>
          <Button
            title="Hedefleri gör"
            secondary
            onPress={() => navigation.navigate("ChallengesTab")}
          />
        </Card>
      )}
      <Row>
        <Button
          title="Yeni beceri"
          icon={Plus}
          secondary
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("EditSkill")}
        />
        <Button
          title="Antrenman kaydet"
          secondary
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("LogSession")}
        />
      </Row>
      {!sessions.length && (
        <Body>
          {" "}
          Günlüğünüz boş başlar. Üç başlangıç egzersizi yalnızca öneridir;
          kayıtlı antrenman değildir.{" "}
        </Body>
      )}
    </Screen>
  );
}
