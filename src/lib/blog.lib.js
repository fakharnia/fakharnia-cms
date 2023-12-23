export const getRecentPosts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/blog/getRecentPosts`);

    if (!res.ok)
        return undefined;

    const recentPosts = res.json();

    return recentPosts;
}

export const getPost = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/blog/getPost?id=${id}`);

    if (!res.ok)
        return undefined;

    const post = res.json();

    return post;
}

export const deletePost = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/blog/deletePost?id=${id}`, {
        method: "DELETE"
    });

    if (!res.ok)
        return undefined;

    return res.json();
}
