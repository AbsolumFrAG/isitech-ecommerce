import { createContext } from "react";

interface ContextProps {
    isMenuOpen: boolean;

    //Méthodes
    toggleSideMenu: () => void;
}
export const UiContext = createContext({} as ContextProps);