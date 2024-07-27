import React from "react";
import BitcoinRetirementCalculator from "./BitcoinRetirementCalculator";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        {/* <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Bitcoin Retirement Calculator
        </h1> */}
        <BitcoinRetirementCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
