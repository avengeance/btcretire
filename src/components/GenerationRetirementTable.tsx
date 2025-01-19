import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GenerationRetirementTableProps {
  displayInSatoshis: boolean;
}

const GenerationRetirementTable: React.FC<GenerationRetirementTableProps> = ({
  displayInSatoshis,
}) => {
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);

  const generations = [
    { name: "Baby Boomers", estimatedNeed: 990000 },
    { name: "Gen X", estimatedNeed: 1560000 },
    { name: "Millennials", estimatedNeed: 1650000 },
    { name: "Gen Z", estimatedNeed: 1630000 },
  ];

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await response.json();
        setBitcoinPrice(data.bitcoin.usd);
      } catch (err) {
        console.error("Failed to fetch Bitcoin price:", err);
      }
    };

    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatBitcoin = (amount: number) => {
    if (displayInSatoshis) {
      return Math.round(amount * 100000000).toLocaleString() + " sats";
    } else {
      return amount.toFixed(4) + " BTC";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {bitcoinPrice && (
        <div className="flex justify-center text-sm text-gray-500 text-right mb-2">
          <div className="flex items-center bg-orange-500 rounded-sm p-2 text-white">
            Current BTC Price: {formatCurrency(bitcoinPrice)}
          </div>
        </div>
      )}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 text-center">Generation</TableHead>
            <TableHead className="w-1/3 text-center">
              Estimated Retirement Need (USD)
            </TableHead>
            <TableHead className="w-1/3 text-center">
              {displayInSatoshis ? "Satoshis" : "Bitcoin"} Equivalent
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {generations.map((gen) => (
            <TableRow key={gen.name}>
              <TableCell className="text-center">{gen.name}</TableCell>
              <TableCell className="text-center">
                {formatCurrency(gen.estimatedNeed)}
              </TableCell>
              <TableCell className="text-center">
                {bitcoinPrice
                  ? formatBitcoin(gen.estimatedNeed / bitcoinPrice)
                  : "Loading..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GenerationRetirementTable;
