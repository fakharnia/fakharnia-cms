"use client"

import styles from "./login.module.css";

import { useMessage } from "../context/messageContext"

export const Message = () => {

    const { message } = useMessage();

    if (message?.text) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.message}>
                    <p>{message.text}</p>
                    <div className={styles.messageButtons}>
                        {message.ok ? <button onClick={message.ok}>{message.okText}</button> : ''}
                        {
                            message.cancel ? <button onClick={message.cancel}>{message.cancelText}</button> : ''
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}