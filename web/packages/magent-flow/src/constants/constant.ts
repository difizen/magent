export const IS_MAC = navigator.userAgent.toUpperCase().includes('MAC');

export const defaultShortcuts = [
  {
    name: 'Advanced Settings',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Shift + A`,
  },
  {
    name: 'Minimize',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Q`,
  },
  {
    name: 'Code',
    shortcut: `Space`,
  },
  {
    name: 'Copy',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + C`,
  },
  {
    name: 'Duplicate',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + D`,
  },
  {
    name: 'Component Share',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Shift + S`,
  },
  {
    name: 'Docs',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Shift + D`,
  },
  {
    name: 'Save',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + S`,
  },
  {
    name: 'Delete',
    shortcut: 'Backspace',
  },
  {
    name: 'Open playground',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + K`,
  },
  {
    name: 'Undo',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Z`,
  },
  {
    name: 'Redo',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Y`,
  },
  {
    name: 'Group',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + G`,
  },
  {
    name: 'Cut',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + X`,
  },
  {
    name: 'Paste',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + V`,
  },
  {
    name: 'API',
    shortcut: `R`,
  },
  {
    name: 'Download',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + J`,
  },
  {
    name: 'Update',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + U`,
  },
  {
    name: 'Freeze',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + F`,
  },
  {
    name: 'Freeze Path',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + Shift + F`,
  },
  {
    name: 'Flow Share',
    shortcut: `${IS_MAC ? 'Cmd' : 'Ctrl'} + B`,
  },
  {
    name: 'Play',
    shortcut: `P`,
  },
  {
    name: 'Output Inspection',
    shortcut: `O`,
  },
];
