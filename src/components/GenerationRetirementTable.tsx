import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GenerationRetirementTableProps {
  bitcoinPrice: number;
  displayInSatoshis: boolean;
}

const GenerationRetirementTable: React.FC<GenerationRetirementTableProps> = ({
  bitcoinPrice,
  displayInSatoshis,
}) => {
  const generations = [
    { name: "Baby Boomers", estimatedNeed: 990000 },
    { name: "Gen X", estimatedNeed: 1560000 },
    { name: "Millennials", estimatedNeed: 1650000 },
    { name: "Gen Z", estimatedNeed: 1630000 },
  ];

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
                {formatBitcoin(gen.estimatedNeed / bitcoinPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GenerationRetirementTable;
