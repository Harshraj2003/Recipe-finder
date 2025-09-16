import { Box, TextField, Button } from '@mui/material';


const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: 'flex',       
        alignItems: 'center',  
        gap: 2,                
        marginBottom: 4,       
      }}
    >
      <TextField
        variant="outlined"
        label="Search for a recipe..."
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ height: '56px', padding: '0 30px' }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;

