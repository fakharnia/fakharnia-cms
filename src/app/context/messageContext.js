"use client"

import { createContext, useContext, useReducer } from "react";

const MessageContext = createContext();

const messageReducer = (state, action) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            return action.payload;
        case "CANCEL":
            return null
        default:
            return state;
    }
}

export const MessageProvider = ({ children }) => {
    const [message, dispatch] = useReducer(messageReducer, []);

    const addMessage = (message) => {
        dispatch({ type: "ADD_MESSAGE", payload: message });
    };

    const cancel = () => {
        dispatch({ type: "CANCEL" });
    }

    return (
        <MessageContext.Provider value={{ message, addMessage, cancel }}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessage = () => {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }

    return context;
}