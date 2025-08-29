import { createContext, useContext, useState, useCallback, type FC, type ReactNode } from 'react';
import BottomSheet from '../components/common/BottomSheet';

interface BottomSheetContextValue {
  isOpen: boolean;
  open: (content: ReactNode) => void;
  close: () => void;
  toggle: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const BottomSheetProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<ReactNode>(null);

  const open = useCallback((content: ReactNode) => {
    setBottomSheetContent(content);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setBottomSheetContent(null);
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <BottomSheetContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <BottomSheet visible={isOpen} onClose={close}>
        {bottomSheetContent}
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error('useBottomSheet must be used within BottomSheetProvider');
  return ctx;
};
