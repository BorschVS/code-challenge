import { HTMLProps } from 'react';

// base
export interface Theme {
  palette: {
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error: {
      main: string;
    };
  };
  typography: {
    fontFamily: string;
    fontWeightMedium: number;
    fontWeightRegular: number;
    fontWeightBold: number;
  };
  breakpoints: {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

// FancyForm
export interface FormValues {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface Token {
  symbol: string;
  name: string;
  imgSrc: string;
}

// MessyReact

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

export interface Prices {
  [key: string]: number;
}

export interface Props extends HTMLProps<HTMLDivElement> {
  balances: FormattedWalletBalance[];
  prices: Prices;
}

export interface WalletRowProps {
  currency: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}
