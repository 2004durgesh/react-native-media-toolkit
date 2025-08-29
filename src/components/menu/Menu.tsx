import React, { Children, createContext, useMemo, type FC, type ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { useSettingsContext } from '../../providers';
import { useSettings } from '../../hooks';

interface MenuContextProps {
  items: ReactNode[];
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

/**
 * `Root` is the container component for the menu. It manages the collection of `MenuItem` components.
 * It uses a React Context to make the menu items available to its children.
 *
 * @param {object} props - The props for the Root component.
 * @param {ReactNode} props.children - The `MenuItem` components to be rendered within the menu.
 * @returns {JSX.Element} A context provider for menu items.
 */
const Root: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }): JSX.Element => {
  const items = useMemo(() => {
    const menuItems: ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Item) {
        menuItems.push(child);
      }
    });
    return menuItems;
  }, [children]);

  return <MenuContext.Provider value={{ items }}>{children}</MenuContext.Provider>;
};

/**
 * `Item` represents an individual selectable item within the `Menu.Root` component.
 * When pressed, it can trigger an `onPress` callback and/or set a playback rate.
 * It also closes the settings menu upon interaction.
 *
 * @param {object} props - The props for the Item component.
 * @param {ReactNode} props.children - The content to be displayed within the menu item (e.g., text, icon).
 * @param {() => void} [props.onPress] - Optional callback function to be executed when the item is pressed.
 * @param {number} [props.value] - Optional numeric value associated with the item, typically used for setting playback rate.
 * @returns {JSX.Element} A pressable component representing a menu item.
 */
const Item: FC<{ children: ReactNode; onPress?: () => void; value?: number }> = ({ children, onPress, value }) => {
  const { closeSettings } = useSettings();
  const { dispatch } = useSettingsContext();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    if (value) {
      dispatch({ type: 'SET_PLAYBACK_RATE', payload: value });
    }
    closeSettings();
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={handlePress}>
      <Text>{children}</Text>
    </Pressable>
  );
};

export const Menu = {
  Root,
  Item,
};
