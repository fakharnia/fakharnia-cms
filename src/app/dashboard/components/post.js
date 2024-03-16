"use client"

import { useState, useEffect } from "react";

import styles from "../page.module.css";

import { deletePost, getRecentPosts } from "@/lib/post.lib";
import Link from "next/link";
import { useDashboardMessage } from "../context/messageContext";

export const PostComponent = () => {
    const { addMessage, cancel } = useDashboardMessage();

    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        const response = await getRecentPosts();
        console.log(response);
        if (response) {
            setPosts(response);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const onDeletePost = async (postId) => {
        const result = await deletePost(postId);
        if (result !== undefined) {
            addMessage({ text: "Post Successfully Deleted", cancel: cancel });
            await fetchPosts();
        } else {
            addMessage({ text: "Operation Failed!", cancel: cancel });
        }
    }

    const postsListEl = posts.length !== 0 ? posts.map((post, index) => (
        <li className="flex-row flex-justify-between" key={"post" + index}>
            <div className={styles.info}>
                <h5>{post.en_title}</h5>
                <p>{post.createdAt} / {post.views?.length || 0} views / {post.estimateTime} min read</p>
                <ul className="flex-row">
                    {post.tags.map((tag, index) => (
                        <li key={"tag" + index}>{tag}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.options}>
                <Link href={"/dashboard/posts/" + post._id}>Edit</Link>
                <button onClick={() => { onDeletePost(post._id) }}>Delete</button>
            </div>
        </li>
    )) : <li key="post-nodata" className={styles.empty}>You Haven&apos;t Post Any Thing!</li>;

    return postsListEl;

}
