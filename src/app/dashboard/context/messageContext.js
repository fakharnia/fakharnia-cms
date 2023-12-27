"use client"

import { createContext, useContext, useReducer } from "react";

const DashboardMessageContext = createContext();

const dashboardMessageReducer = (state, action) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            return action.payload;
        case "CANCEL":
            return null
        default:
            return state;
    }
}

export const DashboardMessageProvider = ({ children }) => {
    const [message, dispatch] = useReducer(dashboardMessageReducer, null);

    const addMessage = (message) => {
        dispatch({ type: "ADD_MESSAGE", payload: message });
    };

    const cancel = () => {
        dispatch({ type: "CANCEL" });
    }

    return (
        <DashboardMessageContext.Provider value={{ message, addMessage, cancel }}>
            {children}
        </DashboardMessageContext.Provider>
    )
}

export const useDashboardMessage = () => {
    const context = useContext(DashboardMessageContext);

    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }

    return context;
}