"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import componentStyles from "./page.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../context/messageContext";
import { deleteAction, getsAction } from "./action";

const Posts = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;

    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useDashboardMessage();

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await getsAction();
        setPosts(response ?? []);
    }

    useEffect(() => {
        fetchPosts();
        changeMenu("/dashboard/posts");
    }, [])

    const onDeletePost = async (postId) => {
        const result = await deleteAction(postId);
        if (result !== undefined) {
            addMessage({ text: "Post Successfully Deleted", cancel: cancel });
            await fetchPosts();
        } else {
            addMessage({ text: "Operation Failed!", cancel: cancel });
        }
    }

    return (
        <>
            <title>Fakharnia CMS | Posts</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Posts</h5>
                    <Link className={commonStyles.pageAddButton} href="./posts/0">Add</Link>
                </div>
                <ul className={componentStyles.postsList}>
                    {
                        posts.map((post, index) =>
                        (<li key={index} className={componentStyles.post}>
                            <Image className={componentStyles.postImage} src={`${previewURL}/post/${post._id}/${post.coverUrl}`} width={500} height={190} alt={post.coverAlt} />
                            <h5 className={componentStyles.postTitle}>{post.en_title}</h5>
                            <div className={componentStyles.postOptions}>
                                <Link className={componentStyles.postButton} href={"/dashboard/posts/" + post._id}>Edit</Link>
                                <button className={componentStyles.postButton} onClick={() => { onDeletePost(post._id) }}>Delete</button>
                            </div>
                        </li>)
                        )
                    }
                </ul>
                {posts.length === 0 ? <p className={componentStyles.noData}>There isn&apos;t any post yet!</p> : ""}
            </div>
        </>
    )
}

export default Posts;