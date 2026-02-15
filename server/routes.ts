import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";

interface Instrument {
  id: string;
  name: string;
  provider: string;
  type: string;
  annualRate: number;
  ytdRate: number;
  maturityDays: number | null;
  minInvestment: number;
  riskLevel: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  description: string;
}

const instruments: Instrument[] = [
  {
    id: "tbill-91",
    name: "91-Day Treasury Bill",
    provider: "Bank of Ghana",
    type: "T-Bill",
    annualRate: 27.5,
    ytdRate: 26.8,
    maturityDays: 91,
    minInvestment: 100,
    riskLevel: "LOW RISK",
    description: "Short-term government security with 91-day maturity period.",
  },
  {
    id: "tbill-182",
    name: "182-Day Treasury Bill",
    provider: "Bank of Ghana",
    type: "T-Bill",
    annualRate: 28.2,
    ytdRate: 27.5,
    maturityDays: 182,
    minInvestment: 100,
    riskLevel: "LOW RISK",
    description: "Medium-term government security with 182-day maturity period.",
  },
  {
    id: "tbill-365",
    name: "365-Day Treasury Bill",
    provider: "Bank of Ghana",
    type: "T-Bill",
    annualRate: 29.5,
    ytdRate: 28.9,
    maturityDays: 365,
    minInvestment: 100,
    riskLevel: "LOW RISK",
    description: "Long-term government security with 1-year maturity period.",
  },
  {
    id: "achieve-digisave",
    name: "Achieve Digisave Mutual Fund",
    provider: "Achieve Financial Services",
    type: "Mutual Fund",
    annualRate: 25.0,
    ytdRate: 24.2,
    maturityDays: null,
    minInvestment: 50,
    riskLevel: "MEDIUM RISK",
    description: "Digital savings mutual fund offering competitive returns with flexible access.",
  },
  {
    id: "achieve-fixed",
    name: "Achieve Fixed Deposit",
    provider: "Achieve Financial Services",
    type: "Fixed Deposit",
    annualRate: 30.0,
    ytdRate: 29.1,
    maturityDays: 365,
    minInvestment: 500,
    riskLevel: "LOW RISK",
    description: "Fixed deposit product with guaranteed returns over a fixed term.",
  },
  {
    id: "ic-wealth",
    name: "IC Wealth Mutual Fund",
    provider: "IC Securities",
    type: "Mutual Fund",
    annualRate: 26.5,
    ytdRate: 25.8,
    maturityDays: null,
    minInvestment: 100,
    riskLevel: "MEDIUM RISK",
    description: "Diversified mutual fund managed by IC Securities for wealth growth.",
  },
  {
    id: "affinity-future",
    name: "Affinity Future Account",
    provider: "Affinity Capital",
    type: "Savings",
    annualRate: 22.0,
    ytdRate: 21.5,
    maturityDays: null,
    minInvestment: 50,
    riskLevel: "LOW RISK",
    description: "Future-focused savings account with competitive interest rates.",
  },
  {
    id: "epack",
    name: "E-Pack",
    provider: "Databank",
    type: "Money Market",
    annualRate: 24.5,
    ytdRate: 23.8,
    maturityDays: null,
    minInvestment: 100,
    riskLevel: "LOW RISK",
    description: "Databank's electronic investment package for money market instruments.",
  },
  {
    id: "mfund",
    name: "M-Fund",
    provider: "Databank",
    type: "Mutual Fund",
    annualRate: 27.0,
    ytdRate: 26.3,
    maturityDays: null,
    minInvestment: 200,
    riskLevel: "MEDIUM RISK",
    description: "Databank's flagship mutual fund for medium to long-term wealth creation.",
  },
];

function calculateReturn(
  principal: number,
  annualRate: number,
  periodMonths: number,
): { totalReturn: number; earnings: number; effectiveRate: number } {
  const rate = annualRate / 100;
  const years = periodMonths / 12;
  const totalReturn = principal * Math.pow(1 + rate, years);
  const earnings = totalReturn - principal;
  const effectiveRate = (Math.pow(1 + rate, years) - 1) * 100;
  return {
    totalReturn: Math.round(totalReturn * 100) / 100,
    earnings: Math.round(earnings * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/instruments", (_req: Request, res: Response) => {
    res.json(instruments);
  });

  app.get("/api/instruments/compare", (req: Request, res: Response) => {
    const capital = parseFloat(req.query.capital as string) || 1000;
    const periodMonths = parseInt(req.query.period as string) || 12;

    const results = instruments.map((inst) => {
      const calc = calculateReturn(capital, inst.annualRate, periodMonths);
      return {
        ...inst,
        totalReturn: calc.totalReturn,
        earnings: calc.earnings,
        effectiveRate: calc.effectiveRate,
      };
    });

    results.sort((a, b) => b.earnings - a.earnings);

    res.json({
      capital,
      periodMonths,
      instrumentCount: results.length,
      results,
    });
  });

  app.get("/api/instruments/ytd", (req: Request, res: Response) => {
    const capital = parseFloat(req.query.capital as string) || 1000;

    const results = instruments.map((inst) => {
      const ytdEarnings = capital * (inst.ytdRate / 100);
      return {
        ...inst,
        ytdEarnings: Math.round(ytdEarnings * 100) / 100,
        projectedValue: Math.round((capital + ytdEarnings) * 100) / 100,
      };
    });

    results.sort((a, b) => b.ytdRate - a.ytdRate);

    res.json({
      capital,
      instrumentCount: results.length,
      results,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
