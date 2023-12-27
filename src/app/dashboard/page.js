"use client"

import { Suspense } from "react";
import commonStyles from "./page.module.css";
import Loading from "../loading";
import { ChatComponent } from "./components/chat";
import { PostComponent } from "./components/post";

const dashboard = () => {
    return (
        <div className={commonStyles.pageContainer}>
            <div className={`${commonStyles.chatWidget} flex-row`}>
                <h5 className="width-block">Latest Chats</h5>
                <ul className="width-block">
                    <Suspense fallback={<Loading />}>
                        <ChatComponent />
                    </Suspense>
                </ul>
            </div>

            <div className={`${commonStyles.postWidget}  flex-row`}>
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