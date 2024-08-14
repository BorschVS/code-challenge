import { useMemo } from 'react';

import { WalletRow } from './path/to/WalletRow';
import styles from './path/to/styles';

import { Props } from 'types/interfaces';

export const WalletPage: React.FC<Props> = ({
  balances,
  prices,
  ...rest
}: Props) => {
  const getBlockchainPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Neo':
        return 20;
      case 'Zilliqa':
        return 10;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => {
        const priority = getBlockchainPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getBlockchainPriority(lhs.blockchain);
        const rightPriority = getBlockchainPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

  const rows = sortedBalances.map(balance => {
    const formattedAmount: string = balance.amount.toFixed();
    const usdValue: number = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={styles.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedAmount}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
