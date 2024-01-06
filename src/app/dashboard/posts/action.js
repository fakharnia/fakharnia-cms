import { createPost, deletePost, getPost, getPosts, updatePost } from "@/lib/post.lib";

export const getAction = async (postId) => {
    return getPost(postId);
}

export const getsAction = async () => {
    return await getPosts();
}

export const createAction = async (form) => {
    return await createPost(form);
}

export const updateAction = async (form) => {
    return await updatePost(form);
}

export const deleteAction = async (postId) => {
    return await deletePost(postId);
}
