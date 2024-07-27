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
    initialHighWithdrawalRate: 20,
    withdrawalRateDecreaseYears: 2,
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
    let calculatedResults;
    if (selectedScenario === "constant") {
      calculatedResults = calculateScenario(
        inputs.withdrawalRate,
        inputs.withdrawalRate, // Use the same rate for constant scenario
        0 // No decrease rate
      );
    } else {
      calculatedResults = calculateScenario(
        inputs.initialHighWithdrawalRate,
        inputs.finalWithdrawalRate,
        inputs.withdrawalRateDecreaseYears
      );
    }

    if (calculatedResults.length > 0) {
      setResults([calculatedResults]);
    } else {
      console.error("Calculation produced no results");
      setResults([]); // Clear results if calculation fails
    }
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

    let withdrawalRate = initialRate;
    let bitcoinBalance = startingBitcoinBalance; // Initialize the bitcoin balance correctly

    // Calculate the yearly decrease amount
    const yearlyDecreaseAmount =
      finalRate !== undefined && decreaseYears !== undefined
        ? (initialRate - finalRate) / decreaseYears
        : 0;

    // for (let year = 0; year < 25; year++) {
    //   if (year > 0 && decreaseYears !== undefined) {
    //     // Apply the yearly decrease amount for the "decreasing" scenario
    //     if (withdrawalRate > finalRate) {
    //       withdrawalRate = Math.max(
    //         initialRate - yearlyDecreaseAmount * year,
    //         finalRate
    //       );
    //     } else {
    //       withdrawalRate = finalRate;
    //     }
    //   }

    for (let year = 0; year < 25; year++) {
      // Add the initial rate for the first year
      if (year === 0) {
        withdrawalRate = initialRate;
      } else {
        // Decrease the withdrawal rate by the specified decrease amount each year
        if (withdrawalRate > finalRate) {
          withdrawalRate = Math.max(withdrawalRate - decreaseYears, finalRate);
        } else {
          withdrawalRate = finalRate;
        }
      }

      const eoyBitcoinPrice =
        startingBitcoinPrice * Math.pow(1 + growthRate / 100, year + 1);
      const boyBalance =
        bitcoinBalance *
        (year === 0 ? startingBitcoinPrice : data[year - 1].eoyBitcoinPrice);
      const withdrawalAmountBTC = bitcoinBalance * (withdrawalRate / 100);
      const withdrawalAmountUSD = withdrawalAmountBTC * eoyBitcoinPrice;
      const currentBasketOfGoods =
        basketOfGoods * Math.pow(1 + inflationRate / 100, year);

      // Store the current balance before applying the withdrawal
      data.push({
        year: currentYear + year,
        bitcoinBalance,
        boyBalance,
        eoyBitcoinPrice,
        withdrawalAmountBTC,
        withdrawalAmountUSD,
        basketOfGoods: currentBasketOfGoods,
        withdrawalRate,
      });

      // Update the bitcoin balance for the next year
      bitcoinBalance -= withdrawalAmountBTC;
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

  const ResultsChart = () => {
    if (results.length === 0 || !results[0]) {
      return <div>No data to display</div>;
    }
    const currentResults = results[0];

    return (
      <div className="h-[300px] sm:h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            {/* <Line
              yAxisId="left"
              type="monotone"
              dataKey="bitcoinBalance"
              stroke="#8884d8"
              name="BTC Balance"
            /> */}
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
            {/* <Line
              yAxisId="left"
              type="monotone"
              dataKey="withdrawalAmountBTC"
              stroke="#8dd1e1"
              name="Withdrawal (BTC)"
            /> */}
            {/* <Line
              yAxisId="right"
              type="monotone"
              dataKey="withdrawalAmountUSD"
              stroke="#a4de6c"
              name="Withdrawal ($)"
            /> */}
            {/* <Line
              yAxisId="right"
              type="monotone"
              dataKey="basketOfGoods"
              stroke="#d0ed57"
              name="Basket of Goods ($)"
            /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const ResultsTable = () => {
    if (results.length === 0 || !results[0]) {
      return (
        <div className="text-center">
          No results to display. Please calculate first.
        </div>
      );
    }
    const currentResults = results[0];

    return (
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
            {currentResults.map((row, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
                if (
                  selectedScenario === "decreasing" &&
                  key === "withdrawalRate"
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

        {results.length > 0 && results[0] && results[0].length > 0 ? (
          <div>
            <ResultsChart />
            <ResultsTable />
          </div>
        ) : (
          <div className="text-center">
            No results to display. Please calculate first.
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BitcoinRetirementCalculator;
