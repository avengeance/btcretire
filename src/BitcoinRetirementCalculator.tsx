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
import { Switch } from "@/components/ui/switch";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GenerationRetirementTable from "./components/GenerationRetirementTable";

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
  const [inputs, setInputs] = React.useState<InputState>({
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
  const [displayInSatoshis, setDisplayInSatoshis] = useState(false);

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
        inputs.withdrawalRate,
        0
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
      setResults([]);
    }
  };

  const calculateScenario = (
    initialRate: number,
    finalRate: number = initialRate,
    decreaseYears: number = 0
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
    let bitcoinBalance = startingBitcoinBalance;

    const yearlyDecreaseAmount =
      finalRate !== undefined && decreaseYears !== undefined
        ? (initialRate - finalRate) / decreaseYears
        : 0;

    for (let year = 0; year < 25; year++) {
      if (year === 0) {
        withdrawalRate = initialRate;
      } else {
        if (withdrawalRate > finalRate) {
          withdrawalRate = Math.max(
            withdrawalRate - yearlyDecreaseAmount,
            finalRate
          );
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

  const toggleDisplayUnit = () => {
    setDisplayInSatoshis(!displayInSatoshis);
  };

  const formatBitcoinValue = (value: number) => {
    if (displayInSatoshis) {
      return (value * 100000000).toFixed(0);
    }
    return value.toFixed(8);
  };

  const ResultsChart = () => {
    if (results.length === 0 || !results[0]) {
      return <div>No data to display</div>;
    }
    const currentResults = results[0];

    const formattedResults = currentResults.map((row) => ({
      ...row,
      bitcoinBalance: displayInSatoshis
        ? row.bitcoinBalance * 100000000
        : row.bitcoinBalance,
      withdrawalAmountBTC: displayInSatoshis
        ? row.withdrawalAmountBTC * 100000000
        : row.withdrawalAmountBTC,
    }));

    return (
      <div className="h-[300px] sm:h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedResults}>
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
              name={`${displayInSatoshis ? "Satoshi" : "BTC"} Balance`}
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
              name={`Withdrawal (${displayInSatoshis ? "Satoshi" : "BTC"})`}
            />
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

    const numberFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    const numberFormatterNoCurrency = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayInSatoshis ? 0 : 8,
    });

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 py-2 text-xs">Year</th>
              <th className="px-2 py-2 text-xs">
                {displayInSatoshis ? "Satoshi" : "BTC"} Balance
              </th>
              <th className="px-2 py-2 text-xs">BOY Balance ($)</th>
              <th className="px-2 py-2 text-xs">EOY BTC Price ($)</th>
              <th className="px-2 py-2 text-xs">Withdrawal Rate (%)</th>
              <th className="px-2 py-2 text-xs">
                Withdrawal ({displayInSatoshis ? "Satoshi" : "BTC"})
              </th>
              <th className="px-2 py-2 text-xs">Withdrawal ($)</th>
              <th className="px-2 py-2 text-xs">Basket of Goods ($)</th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-500" : ""}>
                <td className="px-2 py-2 text-xs text-center">{row.year}</td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatterNoCurrency.format(
                    displayInSatoshis
                      ? row.bitcoinBalance * 100000000
                      : row.bitcoinBalance
                  )}
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatter.format(row.boyBalance)}
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatter.format(row.eoyBitcoinPrice)}
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {row.withdrawalRate.toFixed(2)}%
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatterNoCurrency.format(
                    displayInSatoshis
                      ? row.withdrawalAmountBTC * 100000000
                      : row.withdrawalAmountBTC
                  )}
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatter.format(row.withdrawalAmountUSD)}
                </td>
                <td className="px-2 py-2 text-xs text-center">
                  {numberFormatter.format(row.basketOfGoods)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const downloadCSV = (data: ResultRow[]) => {
    const csvRows = [];

    const disclaimer = `Disclaimer: The Bitcoin Retirement Calculator provided on this website is for informational and educational purposes only. 
  The results generated by the calculator are based on the inputs provided by the user and are not guaranteed to be accurate complete or up-to-date. 
  The calculator is a tool designed to help users estimate potential outcomes based on various assumptions and should not be relied upon as financial investment or legal advice.
  
  Important Considerations:
  - Assumptions and Projections: The calculations are based on user-provided inputs and assumptions including but not limited to initial Bitcoin balance Bitcoin price growth rate inflation rate withdrawal rate and other variables. 
  These assumptions may not reflect real-world conditions and can significantly impact the results.
  - Market Volatility: The value of Bitcoin and other cryptocurrencies can be highly volatile. Historical performance is not indicative of future results. 
  The calculator does not account for potential market fluctuations regulatory changes or other unforeseen events that may affect the value of Bitcoin.
  - No Financial Advice: This calculator is not intended to provide financial investment or legal advice. Users should consult with a qualified financial advisor or investment professional before making any decisions based on the results of this calculator.
  - Data Accuracy: While efforts are made to ensure the accuracy of the data and assumptions used in the calculator no guarantees are made regarding the accuracy completeness or reliability of the information provided.
  - User Responsibility: Users are solely responsible for the decisions they make based on the results of this calculator. The creators of this website and the Bitcoin Retirement Calculator do not accept any liability for any loss or damage incurred by users as a result of using this tool.
  By using the Bitcoin Retirement Calculator you acknowledge and agree to the terms of this disclaimer.`;

    csvRows.push([disclaimer]);
    csvRows.push([]);

    csvRows.push([
      "",
      "Year",
      `${displayInSatoshis ? "Satoshi" : "Bitcoin"} Balance`,
      "BOY Balance",
      "EOY Bitcoin Price",
      "Withdrawal Rate",
      `Withdrawal Amount ${displayInSatoshis ? "Satoshi" : "BTC"}`,
      "Withdrawal Amount USD",
      "Basket of Goods",
    ]);

    data.forEach((row: ResultRow) => {
      csvRows.push([
        "",
        row.year,
        displayInSatoshis
          ? (row.bitcoinBalance * 100000000).toFixed(0)
          : row.bitcoinBalance.toFixed(8),
        row.boyBalance.toFixed(2),
        row.eoyBitcoinPrice.toFixed(2),
        `${row.withdrawalRate.toFixed(2)}%`,
        displayInSatoshis
          ? (row.withdrawalAmountBTC * 100000000).toFixed(0)
          : row.withdrawalAmountBTC.toFixed(8),
        row.withdrawalAmountUSD.toFixed(2),
        row.basketOfGoods.toFixed(2),
      ]);
    });

    const csvContent = csvRows.map((e) => e.join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "BitcoinRetirementData.csv");
    a.click();
  };

  const downloadPDF = (data: ResultRow[]) => {
    const doc = new jsPDF();

    const tableColumn = [
      "Year",
      `${displayInSatoshis ? "Satoshi" : "Bitcoin"} Balance`,
      "BOY Balance",
      "EOY Bitcoin Price",
      "Withdrawal Rate",
      `Withdrawal Amount ${displayInSatoshis ? "Satoshi" : "BTC"}`,
      "Withdrawal Amount USD",
      "Basket of Goods",
    ];
    const tableRows: (string | number)[][] = [];

    data.forEach((row) => {
      const rowData = [
        row.year,
        displayInSatoshis
          ? (row.bitcoinBalance * 100000000).toFixed(0)
          : row.bitcoinBalance.toFixed(8),
        row.boyBalance.toFixed(2),
        row.eoyBitcoinPrice.toFixed(2),
        `${row.withdrawalRate.toFixed(2)}%`,
        displayInSatoshis
          ? (row.withdrawalAmountBTC * 100000000).toFixed(0)
          : row.withdrawalAmountBTC.toFixed(8),
        row.withdrawalAmountUSD.toFixed(2),
        row.basketOfGoods.toFixed(2),
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    const disclaimer = `
      Disclaimer:
      The Bitcoin Retirement Calculator provided on this website is for informational and educational purposes only.
      The results generated by the calculator are based on the inputs provided by the user and are not guaranteed to be accurate, complete, or up-to-date.
      The calculator is a tool designed to help users estimate potential outcomes based on various assumptions and should not be relied upon as financial, investment, or legal advice.
  
      Important Considerations:
      Assumptions and Projections: The calculations are based on user-provided inputs and assumptions, including but not limited to, initial Bitcoin balance, Bitcoin price growth rate, inflation rate, withdrawal rate, and other variables. These assumptions may not reflect real-world conditions and can significantly impact the results.
      Market Volatility: The value of Bitcoin and other cryptocurrencies can be highly volatile. Historical performance is not indicative of future results. The calculator does not account for potential market fluctuations, regulatory changes, or other unforeseen events that may affect the value of Bitcoin.
      No Financial Advice: This calculator is not intended to provide financial, investment, or legal advice. Users should consult with a qualified financial advisor or investment professional before making any decisions based on the results of this calculator.
      Data Accuracy: While efforts are made to ensure the accuracy of the data and assumptions used in the calculator, no guarantees are made regarding the accuracy, completeness, or reliability of the information provided.
      User Responsibility: Users are solely responsible for the decisions they make based on the results of this calculator. The creators of this website and the Bitcoin Retirement Calculator do not accept any liability for any loss or damage incurred by users as a result of using this tool.
      By using the Bitcoin Retirement Calculator, you acknowledge and agree to the terms of this disclaimer.
    `;

    const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
    doc.addPage();
    doc.text(splitDisclaimer, 10, 10);
    doc.save("BitcoinRetirementData.pdf");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="p-4 max-w-screen-lg mx-auto">
        <a href="/">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            <span className="text-orange-400">Bitcoin</span> Retirement
            Calculator
          </h1>
        </a>
        <div className="my-10">
          <h2 className="text-xl font-bold mb-4 text-center">
            Estimated Retirement Needs by Generation
          </h2>
          <div className="w-full max-w-3xl mx-auto">
            <GenerationRetirementTable
              bitcoinPrice={inputs.startingBitcoinPrice}
              displayInSatoshis={displayInSatoshis}
            />
          </div>
          <p className="my-8 text-center">
            Data sourced from{" "}
            <a
              className="font-bold text-orange-400"
              target="_blank"
              rel="nopener nonreferrer"
              href="https://news.northwesternmutual.com/planning-and-progress-study-2024"
            >
              Northwestern Mutual 2024 Planning & Progress Study
            </a>
            <br></br>
            <span className="text-red-500">
              * Bitcoin Equivalent adjusts to 'Starting Bitcoin Price' default
              Bitcoin value set at $1,000,000
            </span>
          </p>
        </div>
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
            <div className="flex items-center justify-center mb-4">
              <span className="mr-2 text-orange-400">Display in BTC</span>
              <Switch
                checked={displayInSatoshis}
                onCheckedChange={toggleDisplayUnit}
                className="data-[state=checked]:text-orange-400"
              />
              <span className="ml-2 text-orange-400">Display in Satoshis</span>
            </div>
            <ResultsChart />
            <ResultsTable />
          </div>
        ) : (
          <div className="text-center">
            <div className="">
              <h2 className="mb-2 text-center text-red-500">Disclaimer</h2>
              <p className="mx-24 pb-10">
                The Bitcoin Retirement Calculator provided on this website is
                for informational and educational purposes only. The results
                generated by the calculator are based on the inputs provided by
                the user and are not guaranteed to be accurate, complete, or
                up-to-date. The calculator is a tool designed to help users
                estimate potential outcomes based on various assumptions and
                should not be relied upon as financial, investment, or legal
                advice.
              </p>
              <div className="text-center">
                <span className="font-bold my-2">
                  Important Considerations:
                </span>
              </div>
              <ul className="list-disc list-inside mx-24">
                <li>
                  <span className="font-bold">
                    Assumptions and Projections:
                  </span>{" "}
                  The calculations are based on user-provided inputs and
                  assumptions, including but not limited to, initial Bitcoin
                  balance, Bitcoin price growth rate, inflation rate, withdrawal
                  rate, and other variables. These assumptions may not reflect
                  real-world conditions and can significantly impact the
                  results.
                </li>
                <li>
                  <span className="font-bold">Market Volatility:</span> The
                  value of Bitcoin and other cryptocurrencies can be highly
                  volatile. Historical performance is not indicative of future
                  results. The calculator does not account for potential market
                  fluctuations, regulatory changes, or other unforeseen events
                  that may affect the value of Bitcoin.
                </li>
                <li>
                  <span className="font-bold">No Financial Advice:</span> This
                  calculator is not intended to provide financial, investment,
                  or legal advice. Users should consult with a qualified
                  financial advisor or investment professional before making any
                  decisions based on the results of this calculator.
                </li>
                <li>
                  <span className="font-bold">Data Accuracy:</span> While
                  efforts are made to ensure the accuracy of the data and
                  assumptions used in the calculator, no guarantees are made
                  regarding the accuracy, completeness, or reliability of the
                  information provided.
                </li>
                <li>
                  <span className="font-bold">User Responsibility:</span> Users
                  are solely responsible for the decisions they make based on
                  the results of this calculator. The creators of this website
                  and the Bitcoin Retirement Calculator do not accept any
                  liability for any loss or damage incurred by users as a result
                  of using this tool.
                </li>
              </ul>
              <div className="text-center m-10">
                <p>
                  By using the Bitcoin Retirement Calculator, you acknowledge
                  and agree to the terms of this disclaimer.
                </p>
              </div>
            </div>
          </div>
        )}
        {results.length > 0 && results[0] && (
          <div className="flex justify-evenly mt-8">
            <Button
              variant="secondary"
              onClick={() => downloadCSV(results[0])}
              className="btn bg-orange-400"
            >
              Download CSV
            </Button>

            <Button
              variant="secondary"
              onClick={() => downloadPDF(results[0])}
              className="btn bg-orange-400"
            >
              Download PDF
            </Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BitcoinRetirementCalculator;
