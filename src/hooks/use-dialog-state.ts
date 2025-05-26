
import { useState } from 'react';

export function useDialogState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  return {
    isOpen,
    setIsOpen,
  };
}
