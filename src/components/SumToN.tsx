import { ChangeEvent, FC, useState } from 'react';
import { TextField, Box, Typography, Container } from '@mui/material';

import { sumToNIterative, sumToNMath, sumToNRecursive } from 'utils/sumToN';

const SumToN: FC = () => {
  const [iterativeInput, setIterativeInput] = useState<number>(5);
  const [mathInput, setMathInput] = useState<number>(5);
  const [recursiveInput, setRecursiveInput] = useState<number>(5);

  const [iterativeResult, setIterativeResult] = useState<number>(
    sumToNIterative(5)
  );
  const [mathResult, setMathResult] = useState<number>(sumToNMath(5));
  const [recursiveResult, setRecursiveResult] = useState<number>(
    sumToNRecursive(5)
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: 'iterative' | 'math' | 'recursive'
  ) => {
    const value = Number(event.target.value);

    switch (type) {
      case 'iterative':
        setIterativeInput(value);
        setIterativeResult(sumToNIterative(value));
        break;
      case 'math':
        setMathInput(value);
        setMathResult(sumToNMath(value));
        break;
      case 'recursive':
        setRecursiveInput(value);
        setRecursiveResult(sumToNRecursive(value));
        break;
    }
  };

  return (
    <Container sx={{ marginBottom: '40px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sum Calculations
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Iterative Sum"
            type="number"
            value={iterativeInput}
            onChange={e =>
              handleChange(e as ChangeEvent<HTMLInputElement>, 'iterative')
            }
            variant="outlined"
            fullWidth
          />
          <Typography variant="body1">Result: {iterativeResult}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Mathematical Sum"
            type="number"
            value={mathInput}
            onChange={e =>
              handleChange(e as ChangeEvent<HTMLInputElement>, 'math')
            }
            variant="outlined"
            fullWidth
          />
          <Typography variant="body1">Result: {mathResult}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Recursive Sum"
            type="number"
            value={recursiveInput}
            onChange={e =>
              handleChange(e as ChangeEvent<HTMLInputElement>, 'recursive')
            }
            variant="outlined"
            fullWidth
          />
          <Typography variant="body1">Result: {recursiveResult}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SumToN;
