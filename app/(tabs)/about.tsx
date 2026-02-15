import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

const INSTRUMENTS_INFO = [
  {
    name: "Treasury Bills (T-Bills)",
    provider: "Bank of Ghana",
    icon: "shield-checkmark" as const,
    description:
      "Government-backed securities available in 91-day, 182-day, and 365-day tenors. Considered the safest investment option in Ghana with guaranteed returns.",
  },
  {
    name: "Achieve Digisave Mutual Fund",
    provider: "Achieve Financial Services",
    icon: "phone-portrait" as const,
    description:
      "A digital savings mutual fund that offers competitive returns with the flexibility to access your funds. Ideal for short to medium-term savings goals.",
  },
  {
    name: "Achieve Fixed Deposit",
    provider: "Achieve Financial Services",
    icon: "lock-closed" as const,
    description:
      "Fixed deposit product that guarantees returns over a set period. Higher rates than savings accounts with capital protection.",
  },
  {
    name: "IC Wealth Mutual Fund",
    provider: "IC Securities",
    icon: "diamond" as const,
    description:
      "A diversified mutual fund managed by IC Securities, designed for investors seeking wealth growth through a professionally managed portfolio.",
  },
  {
    name: "Affinity Future Account",
    provider: "Affinity Capital",
    icon: "rocket" as const,
    description:
      "A future-focused savings account that helps you build wealth over time with competitive interest rates and flexible contributions.",
  },
  {
    name: "E-Pack",
    provider: "Databank",
    icon: "cube" as const,
    description:
      "Databank's electronic investment package for money market instruments. Provides easy access to money market returns with low minimum investment.",
  },
  {
    name: "M-Fund",
    provider: "Databank",
    icon: "bar-chart" as const,
    description:
      "Databank's flagship mutual fund designed for medium to long-term wealth creation through a diversified investment strategy.",
  },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 16 + webTopInset,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>About</Text>
        <Text style={styles.subtitle}>Investment instruments guide</Text>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={Colors.dark.accent} />
          <Text style={styles.infoText}>
            This app helps you compare investment instruments available in Ghana.
            Enter your desired capital and investment period to see projected
            returns across all instruments.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Instruments</Text>

        {INSTRUMENTS_INFO.map((inst, index) => (
          <View key={index} style={styles.instrumentItem}>
            <View style={styles.instrumentIconWrap}>
              <Ionicons name={inst.icon} size={22} color={Colors.dark.accent} />
            </View>
            <View style={styles.instrumentContent}>
              <Text style={styles.instrumentName}>{inst.name}</Text>
              <Text style={styles.instrumentProvider}>{inst.provider}</Text>
              <Text style={styles.instrumentDesc}>{inst.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.disclaimerCard}>
          <Ionicons name="warning" size={18} color={Colors.dark.badge.medRisk.text} />
          <Text style={styles.disclaimerText}>
            Interest rates shown are indicative and may change. Past performance
            does not guarantee future results. Please consult with a licensed
            financial advisor before making investment decisions.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Investment Advisor v1.0</Text>
          <Text style={styles.footerSubtext}>Data updated periodically</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.dark.text,
    fontFamily: "DMSans_700Bold",
    fontSize: 26,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  infoText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    marginBottom: 16,
  },
  instrumentItem: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
    backgroundColor: Colors.dark.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
  },
  instrumentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  instrumentContent: {
    flex: 1,
  },
  instrumentName: {
    color: Colors.dark.text,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  instrumentProvider: {
    color: Colors.dark.accent,
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    marginBottom: 6,
  },
  instrumentDesc: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(251, 191, 36, 0.08)",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.2)",
  },
  disclaimerText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
  },
  footerSubtext: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
});
