
import { Box, Typography, Alert, AlertTitle } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ErrorComponent = ({ message = 'An unexpected error occurred. Please try again later.' }) => {
  return (
    <Alert 
      severity="error"
      icon={<ReportProblemIcon fontSize="inherit" />}
      sx={{ 
        mt: 4, 
        mx: 'auto', 
        maxWidth: '600px', 
      }}
    >
      <AlertTitle>Error</AlertTitle>
      <Typography variant="body1">
        {message}
      </Typography>
    </Alert>
  );
};

export default ErrorComponent;