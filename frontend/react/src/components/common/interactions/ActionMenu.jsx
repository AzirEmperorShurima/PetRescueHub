import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Report as ReportIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const ActionMenu = ({ onEdit, onDelete, onReport, isOwner = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    if (action === 'edit' && onEdit) onEdit();
    if (action === 'delete' && onDelete) onDelete();
    if (action === 'report' && onReport) onReport();
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {isOwner && onEdit && (
          <MenuItem onClick={() => handleAction('edit')}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>
        )}
        {isOwner && onDelete && (
          <MenuItem onClick={() => handleAction('delete')}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Xóa</ListItemText>
          </MenuItem>
        )}
        {!isOwner && onReport && (
          <MenuItem onClick={() => handleAction('report')}>
            <ListItemIcon>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Báo cáo</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

ActionMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  isOwner: PropTypes.bool
};

export default ActionMenu;