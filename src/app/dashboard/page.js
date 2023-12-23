"use client"

import { Suspense } from "react";

import styles from "./page.module.css";

import { ChatComponent } from "./components/chat";
import { PostComponent } from "./components/post";
import Loading from "../loading";


const dashboard = () => {
    console.log("dashboard mount!");
    return (
        <div className={styles.pageContainer}>
            <div className={`${styles.chatWidget} flex-row`}>
                <h5 className="width-block">Latest Chats</h5>
                <ul className="width-block">
                    <Suspense fallback={<Loading />}>
                        <ChatComponent />
                    </Suspense>
                </ul>
            </div>

            <div className={`${styles.postWidget}  flex-row`}>
                <h5 className="width-block">Latest Posts</h5>
                <ul className="width-block">
                    <Suspense fallback={<Loading />}>
                        <PostComponent />
                    </Suspense>
                </ul>
            </div>
        </div>
    )
}

export default dashboard;