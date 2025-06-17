/**
 * Type Safety Improvements:
 * 1. Added Blockchain type to ensure type safety and prevent invalid blockchain values
 * 2. Made FormattedWalletBalance extend WalletBalance to avoid property duplication
 * 3. Removed 'any' type from getPriority function for better type checking
 */
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/**
 * Code Organization Improvements:
 * 1. Moved blockchain priorities to a constant object for better maintainability
 * 2. Improved component structure with proper type definitions
 */
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * Bug Fix: Simplified getPriority function to use object lookup instead of switch statement
   * This makes it more maintainable and less prone to errors
   */
  const getPriority = (blockchain: Blockchain): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
  };

  /**
   * Performance Optimization:
   * 1. Added useMemo to prevent unnecessary recalculations
   * 2. Fixed filter logic to properly handle balance priorities
   * 3. Improved sorting logic to be more efficient
   * 4. Added proper dependency array
   */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

  /**
   * Performance Optimization:
   * 1. Separated formatting logic into its own memoized value
   * 2. Improved number formatting with toFixed(2) for better precision
   * 3. Added proper dependency array
   */
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  /**
   * Performance Optimization:
   * 1. Memoized row generation to prevent unnecessary re-renders
   * 2. Improved key generation using currency and index
   * 3. Added proper dependency array
   */
  const rows = useMemo(() => {
    return formattedBalances.map((balance, index) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.currency}-${index}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  )
};

export default WalletPage; 