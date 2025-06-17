import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Button,
  TextField,
  Grid
} from '@mui/material';
import PropTypes from 'prop-types';

const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  values,
  onChange,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {fields.map((field) => (
              <Grid item xs={12} sm={field.width || 12} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={values[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  type={field.type || 'text'}
                  multiline={field.multiline}
                  rows={field.rows}
                  select={field.select}
                  SelectProps={field.selectProps}
                  InputLabelProps={field.dateInput ? { shrink: true } : undefined}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelLabel}</Button>
          <Button type="submit" variant="contained" color="primary">
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      multiline: PropTypes.bool,
      rows: PropTypes.number,
      width: PropTypes.number,
      select: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      selectProps: PropTypes.object,
      dateInput: PropTypes.bool
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};

export default FormDialog;