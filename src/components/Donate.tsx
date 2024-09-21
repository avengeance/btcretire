import React from "react";
import btcQRCode from "../assets/btcretireqr.png";
import btcregQR from "../assets/btcregular.png";

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
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center max-w-xs">
          <img
            src={btcQRCode}
            height="300"
            width="300"
            alt="Bitcoin Silent Address QR code"
            title="bitcoin:sp1qqgnrkyeet7yd8a3ucfj0u383tzejxt09csd86jdyjz6ch4lsuyk4jqug75tyz8znsh323vpsm6r4kaul3jn3eky78v3rt5j3q24ygt8595tpss8e"
          />
          <p className="text-sm text-center mt-2">Bitcoin Silent Address:</p>
          <p className="font-mono text-xs break-all text-center mt-1 px-2">
            sp1qqgnrkyeet7yd8a3ucfj0u383tzejxt09csd86jdyjz6ch4lsuyk4jqug75tyz8znsh323vpsm6r4kaul3jn3eky78v3rt5j3q24ygt8595tpss8e
          </p>
          <p className="text-sm text-center mt-2">Compatible wallets:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            <a
              href="https://cakewallet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Cake Wallet
            </a>
            <a
              href="https://bluewallet.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Blue Wallet
            </a>
            <a
              href="https://app.silentium.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Silentium
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center max-w-xs">
          <img
            src={btcregQR}
            height="300"
            width="300"
            alt="Bitcoin Regular Address QR code"
            title="bitcoin:bc1pm6zlpjs8cnw2d8unkzkxwf2ytzyrcz7zw64phs7kvy2kk60lkqdshq88pp"
          />
          <p className="text-sm text-center mt-2">Bitcoin Address:</p>
          <p className="font-mono text-xs break-all text-center mt-1 px-2">
            bc1pm6zlpjs8cnw2d8unkzkxwf2ytzyrcz7zw64phs7kvy2kk60lkqdshq88pp
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-center">
        Thank you for your support! Your contributions help keep this calculator
        free and up-to-date.
      </p>
    </div>
  );
};

export default Donate;
