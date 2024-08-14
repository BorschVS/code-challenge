import { FC, useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import axios from 'axios';
import { FormValues, Token } from 'types/interfaces';
import theme from 'theme';

const API_URL = 'https://interview.switcheo.com/prices.json';

const tokens: Token[] = [
  {
    symbol: 'BLUR',
    name: 'Blur',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BLUR.svg',
  },
  {
    symbol: 'bNEO',
    name: 'bNEO',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/bNEO.svg',
  },
  {
    symbol: 'BUSD',
    name: 'Binance USD',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BUSD.svg',
  },
  {
    symbol: 'USD',
    name: 'US Dollar',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USD.svg',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg',
  },
  {
    symbol: 'GMX',
    name: 'GMX',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/GMX.svg',
  },
  {
    symbol: 'LUNA',
    name: 'Luna',
    imgSrc:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/LUNA.svg',
  },
];

const FancyForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const [rate, setRate] = useState<number | null>(null);
  const [error, setErrorState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');

  const onSubmit: SubmitHandler<FormValues> = data => {
    const { amount, fromCurrency, toCurrency } = data;

    if (!prices[fromCurrency] || !prices[toCurrency]) {
      setErrorState('Invalid currency selected.');
      return;
    }

    const exchangeRate = prices[fromCurrency] / prices[toCurrency];
    const result = amount * exchangeRate;

    alert(`
      You will get ${result.toFixed(4)} ${toCurrency}
      Current ${toCurrency} price: ${rate} per 1 USD
    `);
  };

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const pricesMap: { [key: string]: number } = {};
        data.forEach((item: { currency: string; price: number }) => {
          pricesMap[item.currency] = item.price;
        });

        setPrices(pricesMap);

        if (fromCurrency && toCurrency) {
          const newRate =
            (pricesMap[toCurrency] || 1) / (pricesMap[fromCurrency] || 0);
          setRate(newRate);
        }
      } catch {
        setErrorState('Failed to fetch the exchange rate.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]);

  return (
    <Container>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" gutterBottom>
          Currency Swap
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && <CircularProgress />}

        <Controller
          name="amount"
          control={control}
          defaultValue={0}
          rules={{
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than zero' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              error={!!errors.amount}
              helperText={errors.amount ? errors.amount.message : ''}
              fullWidth
            />
          )}
        />
        <Controller
          name="fromCurrency"
          control={control}
          defaultValue="USD"
          render={({ field }) => (
            <TextField {...field} select label="From" fullWidth>
              {tokens.map(token => (
                <MenuItem
                  key={token.symbol}
                  value={token.symbol}
                  sx={{
                    '&.MuiMenuItem-root': {
                      backgroundColor: theme.palette.primary.light,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <img
                      src={token.imgSrc}
                      alt={token.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {token.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="toCurrency"
          control={control}
          defaultValue="ETH"
          render={({ field }) => (
            <TextField {...field} select label="To" fullWidth>
              {tokens.map(token => (
                <MenuItem
                  key={token.symbol}
                  value={token.symbol}
                  sx={{
                    '&.MuiMenuItem-root': {
                      backgroundColor: theme.palette.primary.light,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <img
                      src={token.imgSrc}
                      alt={token.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {token.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            color: theme.palette.primary.light,
            '&:hover': {
              backgroundColor: theme.palette.secondary.contrastText,
            },
          }}
        >
          Swap
        </Button>
      </Box>
    </Container>
  );
};

export default FancyForm;
