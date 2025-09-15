"use client";

import { createContext, useContext, useState } from 'react';

const MenuLateralContext = createContext();

export const useMenuLateral = () => {
  return useContext(MenuLateralContext);
};

export const ProveedorMenuLateral = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const value = {
    isMenuOpen,
    openMenu,
    closeMenu,
  };

  return (
    <MenuLateralContext.Provider value={value}>
      {children}
    </MenuLateralContext.Provider>
  );
};