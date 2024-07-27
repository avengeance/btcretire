import React from "react";
import btcQRCode from "../assets/btcretireqr.png";

const Donate: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 mb-10">
      <h2 className="text-2xl font-bold mb-4">
        Support the Bitcoin Retirement Calculator
      </h2>
      <p className="text-center mb-4">
        If you find this tool useful, consider donating to support its
        development and maintenance.
      </p>
      <div className="mb-4">
        <img
          src={btcQRCode}
          height="300"
          width="300"
          alt="Bitcoin QR code"
          title="bitcoin:bc1qn88azanum4f2vdr6nldmnxe9vyp7hhspcudz3a"
        />
      </div>
      <p className="text-sm text-center">
        Bitcoin Address: <br />
        <span className="font-mono break-all">
          bc1qn88azanum4f2vdr6nldmnxe9vyp7hhspcudz3a
        </span>
      </p>
      <p className="mt-4 text-sm text-center">
        Thank you for your support! Your contributions help keep this calculator
        free and up-to-date.
      </p>
    </div>
  );
};

export default Donate;
