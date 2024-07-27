import { useState, ChangeEvent, useEffect } from "react";
import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";

import { ThemeProvider } from "./components/ui/theme-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InputState {
  startingBitcoinBalance: number;
  startingBitcoinPrice: number;
  growthRate: number;
  withdrawalRate: number;
  basketOfGoods: number;
  inflationRate: number;
  initialHighWithdrawalRate: number;
  withdrawalRateDecreaseYears: number;
  finalWithdrawalRate: number;
}

interface ResultRow {
  year: number;
  bitcoinBalance: number;
  boyBalance: number;
  eoyBitcoinPrice: number;
  withdrawalAmountBTC: number;
  withdrawalAmountUSD: number;
  basketOfGoods: number;
  withdrawalRate: number;
}

const BitcoinRetirementCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>({
    startingBitcoinBalance: 1,
    startingBitcoinPrice: 1000000,
    growthRate: 20,
    withdrawalRate: 5,
    basketOfGoods: 60000,
    inflationRate: 5,
    initialHighWithdrawalRate: 50,
    withdrawalRateDecreaseYears: 10,
    finalWithdrawalRate: 5,
  });

  const [results, setResults] = useState<ResultRow[][]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<
    "constant" | "decreasing"
  >("constant");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: parseFloat(value) || 0,
    }));
  };

  const calculateRetirement = () => {
    const constantRateResults = calculateScenario(inputs.withdrawalRate);
    const decreasingRateResults = calculateScenario(
      inputs.initialHighWithdrawalRate,
      inputs.finalWithdrawalRate,
      inputs.withdrawalRateDecreaseYears
    );
    setResults([constantRateResults, decreasingRateResults]);
  };

  const calculateScenario = (
    initialRate: number,
    finalRate?: number,
    decreaseYears?: number
  ): ResultRow[] => {
    const data: ResultRow[] = [];
    const currentYear = new Date().getFullYear();
    let {
      startingBitcoinBalance,
      startingBitcoinPrice,
      growthRate,
      basketOfGoods,
      inflationRate,
    } = inputs;

    //   // Initial year calculations
    //   const initialEOYBitcoinPrice =
    //     startingBitcoinPrice * (1 + growthRate / 100);
    //   const initialWithdrawalBTC =
    //     startingBitcoinBalance * (withdrawalRate / 100);
    //   data.push({
    //     year: currentYear,
    //     bitcoinBalance: startingBitcoinBalance,
    //     boyBalance: startingBitcoinBalance * startingBitcoinPrice,
    //     eoyBitcoinPrice: initialEOYBitcoinPrice,
    //     withdrawalAmountBTC: initialWithdrawalBTC,
    //     withdrawalAmountUSD: initialWithdrawalBTC * initialEOYBitcoinPrice,
    //     basketOfGoods: basketOfGoods,
    //   });

    //   // Calculate for subsequent years
    //   for (let year = 1; year < 25; year++) {
    //     const prevYear = data[year - 1];
    //     const bitcoinBalance =
    //       prevYear.bitcoinBalance - prevYear.withdrawalAmountBTC;
    //     const eoyBitcoinPrice = prevYear.eoyBitcoinPrice * (1 + growthRate / 100);
    //     const boyBalance = bitcoinBalance * prevYear.eoyBitcoinPrice;
    //     const withdrawalAmountBTC = bitcoinBalance * (withdrawalRate / 100);
    //     const withdrawalAmountUSD = withdrawalAmountBTC * eoyBitcoinPrice;
    //     const currentBasketOfGoods =
    //       prevYear.basketOfGoods * (1 + inflationRate / 100);

    //     data.push({
    //       year: currentYear + year,
    //       bitcoinBalance,
    //       boyBalance,
    //       eoyBitcoinPrice,
    //       withdrawalAmountBTC,
    //       withdrawalAmountUSD,
    //       basketOfGoods: currentBasketOfGoods,
    //     });
    //   }

    //   setResults(data);
    // };

    for (let year = 0; year < 25; year++) {
      const withdrawalRate =
        finalRate !== undefined
          ? initialRate -
            (initialRate - finalRate) * Math.min(year / decreaseYears!, 1)
          : initialRate;

      const bitcoinBalance =
        year === 0 ? startingBitcoinBalance : data[year - 1].bitcoinBalance;
      const eoyBitcoinPrice =
        startingBitcoinPrice * Math.pow(1 + growthRate / 100, year);
      const boyBalance =
        bitcoinBalance *
        (year === 0 ? startingBitcoinPrice : data[year - 1].eoyBitcoinPrice);
      const withdrawalAmountBTC = bitcoinBalance * (withdrawalRate / 100);
      const withdrawalAmountUSD = withdrawalAmountBTC * eoyBitcoinPrice;
      const currentBasketOfGoods =
        basketOfGoods * Math.pow(1 + inflationRate / 100, year);

      data.push({
        year: currentYear + year,
        bitcoinBalance: bitcoinBalance - withdrawalAmountBTC,
        boyBalance,
        eoyBitcoinPrice,
        withdrawalAmountBTC,
        withdrawalAmountUSD,
        basketOfGoods: currentBasketOfGoods,
        withdrawalRate,
      });
    }

    return data;
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const ResultsChart = () => (
    <div className="h-[300px] sm:h-[400px] mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={results[selectedScenario === "constant" ? 0 : 1]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bitcoinBalance"
            stroke="#8884d8"
            name="BTC Balance"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="boyBalance"
            stroke="#82ca9d"
            name="BOY Balance ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="eoyBitcoinPrice"
            stroke="#ffc658"
            name="EOY BTC Price ($)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="withdrawalRate"
            stroke="#ff7300"
            name="Withdrawal Rate (%)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="withdrawalAmountBTC"
            stroke="#8dd1e1"
            name="Withdrawal (BTC)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="withdrawalAmountUSD"
            stroke="#a4de6c"
            name="Withdrawal ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="basketOfGoods"
            stroke="#d0ed57"
            name="Basket of Goods ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const ResultsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-2 py-2 text-xs">Year</th>
            <th className="px-2 py-2 text-xs">BTC Balance</th>
            <th className="px-2 py-2 text-xs">BOY Balance ($)</th>
            <th className="px-2 py-2 text-xs">EOY BTC Price ($)</th>
            <th className="px-2 py-2 text-xs">Withdrawal Rate (%)</th>
            <th className="px-2 py-2 text-xs">Withdrawal (BTC)</th>
            <th className="px-2 py-2 text-xs">Withdrawal ($)</th>
            <th className="px-2 py-2 text-xs">Basket of Goods ($)</th>
          </tr>
        </thead>
        <tbody>
          {results[selectedScenario === "constant" ? 0 : 1].map(
            (row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-500" : ""}>
                <td className="px-2 py-2 text-xs">{row.year}</td>
                <td className="px-2 py-2 text-xs">
                  {row.bitcoinBalance.toFixed(8)}
                </td>
                <td className="px-2 py-2 text-xs">
                  ${row.boyBalance.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-xs">
                  ${row.eoyBitcoinPrice.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-xs">
                  {row.withdrawalRate.toFixed(2)}%
                </td>
                <td className="px-2 py-2 text-xs">
                  {row.withdrawalAmountBTC.toFixed(8)}
                </td>
                <td className="px-2 py-2 text-xs">
                  ${row.withdrawalAmountUSD.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-xs">
                  ${row.basketOfGoods.toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="p-4 max-w-screen-lg mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Bitcoin Retirement Calculator
        </h1>
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <Select
              onValueChange={(value: "constant" | "decreasing") =>
                setSelectedScenario(value)
              }
              className="mb-4"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="constant">
                  Constant Withdrawal Rate
                </SelectItem>
                <SelectItem value="decreasing">
                  Decreasing Withdrawal Rate
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {Object.entries(inputs).map(([key, value]) => {
                if (
                  selectedScenario === "constant" &&
                  [
                    "initialHighWithdrawalRate",
                    "withdrawalRateDecreaseYears",
                    "finalWithdrawalRate",
                  ].includes(key)
                ) {
                  return null;
                }
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <Input
                      type="number"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
            <Button onClick={calculateRetirement} className="w-full mb-4">
              Calculate
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div>
            {isMobile ? (
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <ResultsChart />
                </TabsContent>
                <TabsContent value="table">
                  <ResultsTable />
                </TabsContent>
              </Tabs>
            ) : (
              <div>
                <ResultsChart />
                <ResultsTable />
              </div>
            )}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BitcoinRetirementCalculator;
