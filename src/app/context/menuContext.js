"use client"

import { createContext, useContext, useReducer } from "react";

const MenuContext = createContext();

const menuReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_MENU":
            return action.payload;
        default:
            return state;
    }
}

export const MenuProvider = ({ children }) => {
    const [menu, dispatch] = useReducer(menuReducer, "");

    const changeMenu = (menu) => {
        dispatch({ type: "CHANGE_MENU", payload: menu })
    };

    return (
        <MenuContext.Provider value={{ menu, changeMenu }}>
            {children}
        </MenuContext.Provider>
    )
}

export const useMenu = () => {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error("useMenu must be used within a MenuProvider");
    }

    return context;
}