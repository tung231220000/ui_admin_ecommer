import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Avatar, Typography, ListItemText, ListItemAvatar, MenuItem } from '@mui/material';
import IconButtonAnimate from "@/components/animate/IconButtonAnimate";
import React from 'react';
import Iconify from "@/components/Iconify";
import MenuPopover from "@/components/MenuPopover";
// utils
// _mock_
import {_contacts} from "@/_mock";
import Scrollbar from "@/components/Scrollbar";
import BadgeStatus from "@/components/BadgeStatus";
import {fToNow} from "@/utils/formatTime";
// components

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Iconify icon={'eva:people-fill'} width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Contacts <Typography component="span">({_contacts.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }}>
          {_contacts.map((contact) => (
            <MenuItem key={contact.id}>
              <ListItemAvatar sx={{ position: 'relative' }}>
                <Avatar src={contact.avatar} />
                <BadgeStatus
                  status={contact.status}
                  sx={{ position: 'absolute', right: 1, bottom: 1 }}
                />
              </ListItemAvatar>

              <ListItemText
                primaryTypographyProps={{ typography: 'subtitle2', mb: 0.25 }}
                secondaryTypographyProps={{ typography: 'caption' }}
                primary={contact.name}
                secondary={contact.status === 'offline' && fToNow(contact.lastActivity)}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
