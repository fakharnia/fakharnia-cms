export const getRecentPosts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/getRecentPosts`,
        { cache: 'no-store' });

    if (res.status !== 200)
        return undefined;
    return res.json();
}

export const getPost = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/getPost?id=${id}`,
        { cache: 'no-store' });

    if (res.status !== 200)
        return undefined;
    return res.json();
}

export const getPosts = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/getPosts`,
        { cache: 'no-store' });

    if (res.status !== 200)
        return undefined;
    return res.json();
}

export const createPost = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/createPost`, {
        method: 'POST',
        body: form
    });

    if (res.status !== 200)
        return undefined;
    return res.json();
}

export const updatePost = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/updatePost`, {
        method: 'POST',
        body: form,
        cache: 'no-store'
    });

    if (res.status !== 200)
        return undefined;

    return res.json();
}

export const deletePost = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/deletePost/${id}`, {
        method: "POST"
    });

    if (res.status !== 200)
        return undefined;
    return res.json();
}
