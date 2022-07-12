import { FC, useReducer } from "react";
import { UiContext, UiReducer } from "./";

export interface UiState {
  isMenuOpen: boolean;
}
interface Props {
  children: React.ReactNode;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({
      type: "[UI] - ToggleMenu",
    });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,

        //Méthodes
        toggleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
