import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import InstrumentCard from "@/components/InstrumentCard";
import { getApiUrl } from "@/lib/query-client";

const PERIODS = [
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 },
  { label: "2 years", months: 24 },
  { label: "3 years", months: 36 },
  { label: "5 years", months: 60 },
];

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const [capitalInput, setCapitalInput] = useState("1000");
  const [selectedPeriod, setSelectedPeriod] = useState(12);

  const capital = parseFloat(capitalInput.replace(/,/g, "")) || 0;

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    capital: number;
    periodMonths: number;
    instrumentCount: number;
    results: Array<{
      id: string;
      name: string;
      provider: string;
      type: string;
      annualRate: number;
      maturityDays: number | null;
      minInvestment: number;
      riskLevel: string;
      totalReturn: number;
      earnings: number;
      effectiveRate: number;
    }>;
  }>({
    queryKey: ["/api/instruments/compare", `?capital=${capital}&period=${selectedPeriod}`],
    enabled: capital > 0,
  });

  const handlePeriodSelect = useCallback((months: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPeriod(months);
  }, []);

  const handleRefresh = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    refetch();
  }, [refetch]);

  const formatInputDisplay = (val: string) => {
    const num = parseFloat(val.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-GH");
  };

  const periodLabel = PERIODS.find((p) => p.months === selectedPeriod)?.label || "1 year";
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
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={Colors.dark.accent}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Investment Advisor</Text>
            <Text style={styles.subtitle}>Compare returns across instruments</Text>
          </View>
          <Pressable
            onPress={handleRefresh}
            style={({ pressed }) => [styles.refreshBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="refresh" size={22} color={Colors.dark.accent} />
          </Pressable>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputLabelRow}>
            <Ionicons name="wallet-outline" size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.inputLabel}>Investment Capital (GHS)</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>GHS</Text>
            <TextInput
              style={styles.input}
              value={capitalInput}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, "");
                setCapitalInput(cleaned);
              }}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={Colors.dark.textMuted}
              selectionColor={Colors.dark.accent}
            />
          </View>
          {capital > 0 && (
            <Text style={styles.formattedAmount}>
              Formatted: GHS {formatInputDisplay(capitalInput)}
            </Text>
          )}
        </View>

        <View style={styles.periodSection}>
          <View style={styles.inputLabelRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.inputLabel}>Investment Period</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodPills}
          >
            {PERIODS.map((period) => (
              <Pressable
                key={period.months}
                onPress={() => handlePeriodSelect(period.months)}
                style={[
                  styles.periodPill,
                  selectedPeriod === period.months && styles.periodPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.periodPillText,
                    selectedPeriod === period.months && styles.periodPillTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {isLoading && capital > 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.accent} />
            <Text style={styles.loadingText}>Calculating returns...</Text>
          </View>
        ) : data && data.results.length > 0 ? (
          <>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconRow}>
                <Ionicons name="trending-up" size={18} color={Colors.dark.accent} />
                <Text style={styles.summaryText}>
                  {data.instrumentCount} instruments available
                </Text>
              </View>
              <Text style={styles.summarySubtext}>
                Sorted by highest potential return for GHS{" "}
                {capital.toLocaleString("en-GH")} over {periodLabel}
              </Text>
            </View>

            {data.results.map((instrument, index) => (
              <InstrumentCard
                key={instrument.id}
                name={instrument.name}
                provider={instrument.provider}
                type={instrument.type}
                annualRate={instrument.annualRate}
                maturityDays={instrument.maturityDays}
                minInvestment={instrument.minInvestment}
                riskLevel={instrument.riskLevel}
                totalReturn={instrument.totalReturn}
                earnings={instrument.earnings}
                effectiveRate={instrument.effectiveRate}
                isBest={index === 0}
                rank={index + 1}
                mode="compare"
                capital={capital}
              />
            ))}
          </>
        ) : capital === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calculator-outline" size={48} color={Colors.dark.textMuted} />
            <Text style={styles.emptyText}>
              Enter your investment capital to compare instruments
            </Text>
          </View>
        ) : null}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  inputLabel: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    paddingHorizontal: 16,
    height: 56,
  },
  currencyPrefix: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontFamily: "DMSans_700Bold",
    fontSize: 24,
  },
  formattedAmount: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  periodSection: {
    marginBottom: 24,
  },
  periodPills: {
    flexDirection: "row",
    gap: 8,
  },
  periodPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceElevated,
  },
  periodPillActive: {
    backgroundColor: Colors.dark.accent,
  },
  periodPillText: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
  },
  periodPillTextActive: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
  },
  summaryRow: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  summaryText: {
    color: Colors.dark.text,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
  },
  summarySubtext: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    marginLeft: 26,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    textAlign: "center",
    maxWidth: 240,
  },
});
