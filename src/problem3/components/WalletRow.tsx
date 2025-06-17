import React from 'react';
import { Box, Typography } from '@mui/material';

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

export const WalletRow: React.FC<WalletRowProps> = ({
  className,
  amount,
  usdValue,
  formattedAmount,
}) => {
  return (
    <Box className={className} display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1">
        Amount: {formattedAmount}
      </Typography>
      <Typography variant="body1">
        USD Value: ${usdValue.toFixed(2)}
      </Typography>
    </Box>
  );
}; 