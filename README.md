# Bitcoin Retirement Calculator

## Overview

The Bitcoin Retirement Calculator is a web-based tool designed to help individuals plan their retirement using Bitcoin as an investment vehicle. This calculator allows users to input various parameters such as initial Bitcoin balance, Bitcoin price, growth rate, and withdrawal rate to project their retirement savings over time.

## Features

- Calculate retirement projections based on Bitcoin investments
- Support for constant and decreasing withdrawal rate scenarios
- Interactive chart displaying key metrics over time
- Detailed table view of year-by-year projections
- Responsive design for both desktop and mobile devices
- About section with project information
- Donation option to support the project's development

## Technologies Used

- React
- TypeScript
- Recharts for data visualization
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (version 12 or later)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/bitcoin-retirement-calculator.git
   ```

2. Navigate to the project directory:

   ```
   cd bitcoin-retirement-calculator
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the development server:

   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:3000` to view the application.

## Usage

1. Enter your starting Bitcoin balance and current Bitcoin price.
2. Set the expected growth rate and withdrawal rate.
3. Input your expected annual expenses (Basket of Goods) and inflation rate.
4. Choose between constant or decreasing withdrawal rate scenarios.
5. Click "Calculate" to see your retirement projections.
6. View the results in both chart and table format.

## Contributing

Contributions to improve the Bitcoin Retirement Calculator are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Contact

Calvin Le - email.calvinle@gmail.com

Project Link: [https://github.com/yourusername/bitcoin-retirement-calculator](https://github.com/yourusername/bitcoin-retirement-calculator)

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
