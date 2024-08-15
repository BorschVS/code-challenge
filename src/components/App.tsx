import { FC } from 'react';

import SumToN from './SumToN';
import FancyForm from './FancyForm';
import WalletPage from './MessyReact';

const balances = [
  {
    currency: 'USD',
    amount: 100,
    blockchain: 'Ethereum',
    formatted: '100.00',
  },
  { currency: 'BTC', amount: 0.5, blockchain: 'Osmosis', formatted: '0.50' },
  { currency: 'ETH', amount: 2, blockchain: 'Arbitrum', formatted: '2.00' },
  { currency: 'ZIL', amount: 1000, blockchain: 'Neo', formatted: '1000.00' },
];

const prices = {
  USD: 1,
  BTC: 30000,
  ETH: 2000,
  ZIL: 0.02,
};

const App: FC = () => (
  <div>
    <SumToN />
    <FancyForm />
    <WalletPage balances={balances} prices={prices} />;
  </div>
);

export default App;
