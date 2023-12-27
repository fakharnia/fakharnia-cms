"use client"

import styles from "../page.module.css"

import { useDashboardMessage } from "../context/messageContext"

export const DashboardMessage = () => {

    const { message } = useDashboardMessage();

    setTimeout(() => {
        if (message) {
            message?.cancel();
        }
    }, 5000);

    if (message?.text) {
        return (
            <div className={styles.message + ' ' + (message.type === "error" ? styles.typeError : styles.typeMessage)} onClick={message.cancel}>
                <p>{message.text}</p>
            </div>
        )
    } else {
        return <></>
    }
}