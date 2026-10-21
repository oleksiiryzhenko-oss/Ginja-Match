import { labelForUi } from "../utils/labels.mjs";
import React from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../utils/colors";
import { ArrowLeft } from "lucide-react-native";
export function Screen({ children, title, subtitle, action, scroll = true, safeAreaEdges = ["top", "left", "right"], onBack }) {
  const body = (
    <>
      <View style={[s.header, onBack && { paddingTop: 0, alignItems: "flex-start" }]}>
        {onBack && (
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} hitSlop={8} style={{ padding: 8 }}>
            <ArrowLeft color={colors.primary} size={24} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          {!onBack && <Text style={s.eyebrow}>GINJA / MATCH</Text>}
          <Text accessibilityRole="header" style={[s.title, onBack && { fontSize: 24, marginBottom: 4 }]}>
            {title}
          </Text>
          {subtitle && <Text style={s.muted}>{subtitle}</Text>}
        </View>
        {action}
      </View>
      {children}
      <View style={{ height: 24 }} />
    </>
  );
  return (
    <SafeAreaView edges={safeAreaEdges} style={s.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.content}
          >
            {body}
          </ScrollView>
        ) : (
          <View style={s.content}>{body}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export const Card = ({ children, style }) => (
  <View style={[s.card, style]}>{children}</View>
);
export const Heading = ({ children }) => (
  <Text style={s.heading}>{children}</Text>
);
export const Body = ({ children, style }) => (
  <Text style={[s.muted, style]}>{children}</Text>
);
export const Label = ({ children }) => <Text style={s.label}>{children}</Text>;
export function Button({
  title,
  accessibilityLabel,
  onPress,
  secondary,
  danger,
  disabled,
  icon: Icon,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        danger && { backgroundColor: colors.elevated },
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        style,
      ]}
    >
      {Icon && (
        <Icon
          size={18}
          color={secondary ? colors.primary : colors.background}
        />
      )}
      <Text
        style={[
          s.buttonText,
          secondary && { color: colors.primary },
          danger && { color: colors.danger },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, value, onChangeText, multiline, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Label>{labelForUi(label)}</Label>
      <TextInput
        accessibilityLabel={labelForUi(label)}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        style={[
          s.input,
          multiline && { height: 100, textAlignVertical: "top" },
        ]}
        {...props}
      />
    </View>
  );
}
export function Chips({ items, value, onChange }) {
  return (
    <View style={s.wrap}>
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const key = typeof item === "string" ? item : item.value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: value === key }}
            key={key}
            onPress={() => onChange(key)}
            style={[s.chip, value === key && s.activeChip]}
          >
            <Text
              style={{
                color: value === key ? colors.primary : colors.muted,
                fontWeight: "600",
              }}
            >
              {labelForUi(label)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Metric({ label, value, small }) {
  return (
    <View style={[s.metric, small && { padding: 12 }]}>
      <Text style={[s.number, small && { fontSize: 24 }]}>{value}</Text>
      <Text style={s.metricLabel}>{labelForUi(label)}</Text>
    </View>
  );
}
export function Progress({ value }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: value }}
      style={s.track}
    >
      <View
        style={[s.fill, { width: `${Math.min(100, Math.max(0, value))}%` }]}
      />
    </View>
  );
}
export function Empty({ title, text, action }) {
  return (
    <Card style={{ alignItems: "center", paddingVertical: 32 }}>
      <Text style={s.emptyMark}>✦</Text>
      <Heading>{title}</Heading>
      <Body style={{ textAlign: "center", marginBottom: 16 }}>{text}</Body>
      {action}
    </Card>
  );
}
export const Row = ({ children, style }) => (
  <View style={[s.row, style]}>{children}</View>
);
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 6,
    gap: 12,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  heading: { color: colors.text, fontSize: 19, fontWeight: "700" },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondary: {
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: { color: colors.background, fontSize: 14, fontWeight: "800" },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 50,
    fontSize: 16,
    color: colors.text,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  activeChip: { backgroundColor: colors.elevated, borderColor: colors.primary },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  metric: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.elevated,
    gap: 6,
  },
  number: { color: colors.primary, fontSize: 30, fontWeight: "800" },
  metricLabel: { color: colors.muted, fontSize: 11 },
  track: {
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.primary },
  emptyMark: { color: colors.primary, fontSize: 38 },
});
