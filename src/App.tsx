import React from "react";
import BitcoinRetirementCalculator from "./BitcoinRetirementCalculator";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="App">
      <BitcoinRetirementCalculator />
      <Footer />
    </div>
  );
};

export default App;
