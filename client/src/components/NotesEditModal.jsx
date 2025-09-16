
import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material';


const NotesEditModal = ({ open, onClose, recipe, onSave }) => {
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    if (recipe) {
      setNotesText(recipe.notes);
    }
  }, [recipe]); 

  const handleSave = () => {
    onSave(recipe.idMeal, notesText);
  };

  if (!recipe) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Notes for {recipe.strMeal}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Add or update your personal notes for this recipe.
        </Typography>
        <TextField
          autoFocus 
          margin="dense"
          id="notes"
          label="Your Personal Notes"
          type="text"
          fullWidth
          variant="outlined"
          multiline 
          rows={4} 
          value={notesText} 
          onChange={(e) => setNotesText(e.target.value)} 
        />
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 24px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesEditModal;