// utils/avatar.js
export const generateAvatarUrl = (name, size = 200, background = 'random') => {
    const formattedName = name.replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${formattedName}&size=${size}&background=${background}`;
  };