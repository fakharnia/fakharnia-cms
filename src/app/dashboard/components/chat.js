"use client"

import { useState, useEffect } from "react";

import styles from "../page.module.css";

export const ChatComponent = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchChats = [];
                setChats(fetchChats || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchData();
    }, []);

    const chatsListEl = chats.length !== 0 ? chats.map((chat, index) =>
    (<li className="flex-row" key={"chat" + index}>
        <i className="cms-chat"></i>
        <div className="flex-row">
            <strong>{chat.mobile}</strong>
            <span>{chat.createdAt}</span>
            <p>{chat.lastText}</p>
            <small className="flex-row flex-align-center flex-justify-around">
                <i>{chat.unreded}</i>
            </small>
        </div>
    </li>)
    ) : <li key="chat-nodata" className={styles.empty}>You Haven&apos;t Any Chat Yet!</li>;

    return chatsListEl;
}
