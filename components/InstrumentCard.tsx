import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface InstrumentCardProps {
  name: string;
  provider: string;
  type: string;
  annualRate: number;
  maturityDays: number | null;
  minInvestment: number;
  riskLevel: string;
  totalReturn?: number;
  earnings?: number;
  effectiveRate?: number;
  ytdRate?: number;
  ytdEarnings?: number;
  projectedValue?: number;
  isBest?: boolean;
  rank: number;
  mode: "compare" | "ytd";
  capital: number;
}

function formatCurrency(amount: number): string {
  return `GH\u20B5${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getRiskBadgeStyle(risk: string) {
  if (risk === "LOW RISK") return Colors.dark.badge.lowRisk;
  if (risk === "MEDIUM RISK") return Colors.dark.badge.medRisk;
  return Colors.dark.badge.highRisk;
}

export default function InstrumentCard({
  name,
  provider,
  type,
  annualRate,
  maturityDays,
  minInvestment,
  riskLevel,
  totalReturn,
  earnings,
  effectiveRate,
  ytdRate,
  ytdEarnings,
  projectedValue,
  isBest,
  rank,
  mode,
  capital,
}: InstrumentCardProps) {
  const riskStyle = getRiskBadgeStyle(riskLevel);

  return (
    <View style={[styles.card, isBest && styles.bestCard]}>
      {isBest && (
        <View style={styles.bestBanner}>
          <Text style={styles.bestBannerText}>BEST RETURN</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.nameSection}>
            <Text style={styles.instrumentName}>{name}</Text>
            <Text style={styles.provider}>{provider}</Text>
          </View>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: riskStyle.bg }]}>
              <Text style={[styles.badgeText, { color: riskStyle.text }]}>{riskLevel}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.dark.badge.type.bg }]}>
              <Text style={[styles.badgeText, { color: Colors.dark.badge.type.text }]}>{type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="trending-up" size={14} color={Colors.dark.accent} />
            <Text style={styles.detailText}>
              {mode === "compare" ? `${annualRate}% p.a.` : `${ytdRate}% YTD`}
            </Text>
          </View>
          {maturityDays && (
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color={Colors.dark.textSecondary} />
              <Text style={styles.detailText}>{maturityDays} days</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="ellipse-outline" size={14} color={Colors.dark.textSecondary} />
            <Text style={styles.detailText}>Min {formatCurrency(minInvestment)}</Text>
          </View>
        </View>

        {mode === "compare" && totalReturn !== undefined && earnings !== undefined && (
          <View style={styles.returnsSection}>
            <View style={styles.returnItem}>
              <Text style={styles.returnLabel}>TOTAL RETURN</Text>
              <Text style={styles.returnValue}>{formatCurrency(totalReturn)}</Text>
            </View>
            <View style={styles.returnItem}>
              <Text style={styles.returnLabel}>EARNINGS</Text>
              <Text style={styles.earningsValue}>+{formatCurrency(earnings)}</Text>
            </View>
          </View>
        )}

        {mode === "compare" && effectiveRate !== undefined && (
          <Text style={styles.effectiveRate}>
            Effective Annual Rate: {effectiveRate}%
          </Text>
        )}

        {mode === "ytd" && ytdEarnings !== undefined && projectedValue !== undefined && (
          <View style={styles.returnsSection}>
            <View style={styles.returnItem}>
              <Text style={styles.returnLabel}>PROJECTED VALUE</Text>
              <Text style={styles.returnValue}>{formatCurrency(projectedValue)}</Text>
            </View>
            <View style={styles.returnItem}>
              <Text style={styles.returnLabel}>YTD EARNINGS</Text>
              <Text style={styles.earningsValue}>+{formatCurrency(ytdEarnings)}</Text>
            </View>
          </View>
        )}

        {mode === "ytd" && ytdRate !== undefined && (
          <View style={styles.ytdBarContainer}>
            <View style={styles.ytdBarBg}>
              <View
                style={[
                  styles.ytdBarFill,
                  { width: `${Math.min((ytdRate / 35) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.ytdBarLabel}>{ytdRate}% avg. YTD</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    marginBottom: 12,
    overflow: "hidden",
  },
  bestCard: {
    borderColor: Colors.dark.accent,
    borderWidth: 1.5,
  },
  bestBanner: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 6,
    alignItems: "center",
  },
  bestBannerText: {
    color: "#FFFFFF",
    fontFamily: "DMSans_700Bold",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
    marginRight: 8,
  },
  instrumentName: {
    color: Colors.dark.text,
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    marginBottom: 2,
  },
  provider: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
  },
  returnsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  returnItem: {},
  returnLabel: {
    color: Colors.dark.textMuted,
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  returnValue: {
    color: Colors.dark.text,
    fontFamily: "DMSans_700Bold",
    fontSize: 22,
  },
  earningsValue: {
    color: Colors.dark.earnings,
    fontFamily: "DMSans_700Bold",
    fontSize: 22,
  },
  effectiveRate: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  ytdBarContainer: {
    marginTop: 4,
  },
  ytdBarBg: {
    height: 6,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  ytdBarFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: 3,
  },
  ytdBarLabel: {
    color: Colors.dark.textSecondary,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
  },
});
