"use client"

import { useState, useEffect } from "react";

import styles from "../page.module.css";

import { getRecentPosts } from "@/lib/blog.lib";

export const PostComponent = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await getRecentPosts();
        setPosts(response);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const postsListEl = posts.length !== 0 ? posts.map((post, index) => (
        <li className="flex-row flex-justify-between" key={"post" + index}>
            <div className={styles.info}>
                <h5>{post.title}</h5>
                <p>{post.createdAt} / {post.views.length} / {post.estimateTime} min read</p>
                <ul className="flex-row">
                    {post.tags.map((tag, index) => (
                        <li key={"tag" + index}>{tag}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.options}>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </li>
    )) : <li key="post-nodata" className={styles.empty}>You Haven&apos;t Post Any Thing!</li>;

    return postsListEl;

}
