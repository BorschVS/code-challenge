# WalletPage Component Refactoring

## Introduction

This document provides a comprehensive analysis of the refactoring process for
the `WalletPage` component, a crucial part of a React TypeScript application.
The refactoring aimed to enhance the code’s maintainability, readability, and
performance by addressing various shortcomings and inefficiencies in the
original implementation.

## Table of Contents

* [Original Code Review](#original-code-review)
* [Type Definitions](#type-definitions)
* [Priority Calculation](#priority-calculation)
* [Balances Filtering and Sorting](#balances-filtering-and-sorting)
* [Data Formatting and Rendering](#data-formatting-and-rendering)
* [Conclusion](#conclusion)

## Original Code Review

### Type Definitions

#### Problem

In the original code, the `WalletBalance` interface was incomplete. It lacked
the `blockchain` property, which was essential for determining the sorting
priority of balances. This omission not only risked runtime errors but also
caused confusion in understanding the data structure.

#### Original Code

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
```

**Analysis**: **Missing Property**: The `blockchain` field, which is necessary
for priority calculation and sorting, was not included in the `WalletBalance`
interface. This omission could lead to issues when trying to access this
property in the component. **Impact**: Without this property, any logic relying
on `blockchain` would fail or produce incorrect results.

#### Improvement

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```

_Refactored Block of Code_: **Added `blockchain` Property**: The `WalletBalance`
interface now correctly includes the `blockchain` property, ensuring that all
relevant data is available for processing. This change prevents potential
runtime errors and improves type safety.

### Priority Calculation

#### Problem

The priority calculation function in the original code used a poorly named
parameter (`blockchain: any`) and a flawed priority scale. Additionally, the use
of the `any` type weakened TypeScript's type-checking capabilities.

#### Original Code

```typescript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};
```

**Analysis**: **Poor Typing**: The use of `any` for the `blockchain` parameter
bypasses TypeScript’s type-checking, potentially leading to unexpected issues.
**Redundant Case Values**: The cases for 'Zilliqa' and 'Neo' have the same
priority value, but the original code does not indicate if this is intentional
or an oversight. **Inconsistent Priority Assignment**: The function has no clear
comment or documentation explaining the priority logic, making it difficult to
maintain or adjust.

#### Improvement

```typescript
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
```

_Refactored Block of Code_: **String Typing**: The parameter type is now
`string`, which is more specific and leverages TypeScript’s type-checking
capabilities. **Refined Priority Values**: The priority values have been
revisited, ensuring that each blockchain has a distinct priority, which aligns
with the intended sorting order. **Clear Naming**: The function is now named
`getBlockchainPriority`, reflecting its purpose more clearly.

### Balances Filtering and Sorting

#### Problem

The original code for filtering and sorting wallet balances was convoluted and
prone to logical errors. It involved unnecessary complexity and incorrect logic,
particularly in how it handled priority and balance filtering.

#### Original Code

```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
}, [balances, prices]);
```

**Analysis**: **Incorrect Filtering Logic**: The filtering logic used incorrect
conditions, potentially allowing balances with zero or negative amounts to pass
through. Additionally, it incorrectly used the priority comparison in the
filtering phase. **Complexity**: The nested `if`-statements in the filtering
process made the code harder to follow and more error-prone. **Misleading
Dependency**: The `prices` dependency in the `useMemo` hook was unnecessary
since it was not used within this block, which could lead to unnecessary
recomputations.

#### Improvement

```typescript
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
```

_Refactored Block of Code_: **Simplified Filtering**: The filtering logic is now
straightforward, correctly filtering out balances with non-positive amounts or
invalid priorities. **Efficient Sorting**: The sorting function is simplified by
directly comparing priorities, improving both readability and performance.
**Correct Dependency Management**: The `useMemo` hook now only depends on
`balances`, removing unnecessary dependencies that could lead to inefficiencies.

### Data Formatting and Rendering

#### Problem

In the original code, data formatting and rendering logic was scattered and
repetitive, making the component harder to maintain and increasing the
likelihood of inconsistencies.

#### Original Code

```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);
```

**Analysis**: **Redundant Data Transformation**: The `amount` was transformed
into a formatted string in one place and then re-used in another, leading to
repeated logic that could be consolidated. **Inconsistent Use of Keys**: The key
for the `WalletRow` components was based on the array index, which is not
recommended when rendering dynamic lists, as it can lead to issues with
component re-rendering.

#### Improvement

```typescript
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
```

_Refactored Block of Code_: **Integrated Formatting**: The formatting of
`amount` is now done directly within the rendering logic, reducing redundancy
and potential errors. **Improved Key Management**: The key for each `WalletRow`
is now derived from `balance.currency`, which is more stable and unique compared
to using the array index. **Streamlined Rendering**: The overall rendering logic
is now more concise and easier to maintain, improving the component's
readability.

## Additional Changes and Improvements

#### Component Integration

#### WalletPage Component:

#### Original Code

```typescript
const WalletPage: React.FC<Props> = ({ balances, prices, ...rest }: Props) => {
  return <div {...rest}>{rows}</div>;
};
```

**Analysis: Styling and Layout:** The WalletPage component used a plain `<div>`
for rendering rows and passing props. This limited the ability to apply
consistent styles and layout. Impact: The lack of styling integration reduced
visual consistency and flexibility.

#### Improvement

```typescript
import { Box } from '@mui/material';

const WalletPage: React.FC<Props> = ({ balances, prices, ...rest }: Props) => {
  const rows = sortedBalances.map(balance => (
    <WalletRow
      key={balance.currency}
      currency={balance.currency}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formattedAmount}
    />
  ));

  return <Box {...rest}>{rows}</Box>;
};
```

**Analysis: Styled Container:** Replaced the plain <div> with MUI's Box
component for enhanced styling and layout. Impact: Improved visual consistency
and allowed the use of MUI’s sx prop for styling.

## WalletRow Component:

## Original Code

```typescript
const WalletRow: FC<WalletRowProps> = ({
  currency,
  amount,
  usdValue,
  formattedAmount,
}) => {
  return (
    <div className="wallet-row">
      <div className="currency">Currency: {currency}</div>
      <div className="amount">Amount: {amount}</div>
      <div className="formatted-amount">
        Formatted amount: {formattedAmount}
      </div>
      <div className="usd-value">USD Value: ${usdValue.toFixed(2)}</div>
    </div>
  );
};
```

**Analysis: Plain HTML Elements:** The WalletRow component used basic HTML
elements for layout and styling, which limited design consistency. Impact:
Styling and layout were inconsistent with the rest of the application.

#### Improvement

```typescript
import { Box, Typography, Paper } from '@mui/material';

const WalletRow: FC<WalletRowProps> = ({
  currency,
  amount,
  usdValue,
  formattedAmount,
}) => {
  return (
    <Container sx={{ margin: '20px auto' }}>
      <Paper sx={{ padding: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography component="p" sx={{ color: theme.palette.primary.light }}>
            Currency: {currency}
          </Typography>
          <Typography component="p" sx={{ color: theme.palette.primary.light }}>
            Amount: {amount}
          </Typography>
          <Typography component="p" sx={{ color: theme.palette.primary.light }}>
            Formatted amount: {formattedAmount}
          </Typography>
          <Typography component="p" sx={{ color: theme.palette.primary.light }}>
            USD Value: ${usdValue.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
```

**Analysis: Enhanced Styling:** Utilized MUI’s Box, Typography, and Paper
components to apply consistent styles. Impact: Improved visual consistency and
usability across the application.

## Prop Types

## Updated Prop Types:

## Original Code

```typescript
const WalletPage: React.FC<Props> = ({ balances, prices, ...rest }: Props) => {
  return <div {...rest}>{rows}</div>;
};
```

**Analysis: Unused Prop:** The formatted prop was mistakenly included and not
used in the WalletPage component. Impact: Introduced potential for confusion and
misuse.

#### Improvement

```typescript
const WalletPage: React.FC<Props> = ({ balances, prices, ...rest }: Props) => {
  const rows = sortedBalances.map(balance => (
    <WalletRow
      key={balance.currency}
      currency={balance.currency}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formattedAmount}
    />
  ));

  return <Box {...rest}>{rows}</Box>;
};
```

## Conclusion

The refactoring of the WalletPage and WalletRow components has substantially
enhanced the quality and maintainability of the code. By addressing key issues
in type definitions, priority calculations, data handling, and rendering, the
updated components now offer several notable improvements:

1. **Enhanced Styling and Layout:**

* **WalletPage:** Replaced a plain `<div>` with MUI’s Box component, facilitating
  more consistent and flexible styling. This change ensures that the layout is
  better aligned with MUI’s design principles. WalletRow: Utilized MUI’s Paper,
  Box, and Typography components to create a more visually appealing and
  consistent design. This enhancement improves the component’s appearance and
  integration with the overall design system.

2. **Improved Prop Management:**

* **WalletPage:** Removed unnecessary props and refined prop handling, ensuring
  that only relevant data is passed and processed. This change clarifies the
  component’s API and improves type safety. WalletRow: Adjusted props to include
  currency, amount, usdValue, and formattedAmount, ensuring comprehensive and
  accurate data display.

3. **Optimized Data Handling:**

* **WalletPage:** Streamlined the filtering and sorting logic for wallet
  balances, focusing on valid and prioritized data. This simplification reduces
  complexity and enhances performance, making the component more efficient.
  Consistent

4. **Rendering Logic:**

* **WalletPage:** Integrated data formatting within the rendering process,
  minimizing redundancy and potential errors. Improved key management using
  balance.currency ensures accurate and efficient rendering.

These refinements not only address previous inefficiencies but also align the
components with modern React practices and MUI’s design standards. As a result,
the WalletPage and WalletRow components are now more robust, maintainable, and
easier to extend, providing a solid foundation for future development.
