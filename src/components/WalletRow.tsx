import { FC } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';

import { WalletRowProps } from 'types/interfaces';
import theme from 'theme';

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

export default WalletRow;
