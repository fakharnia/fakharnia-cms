export const getProject = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/getProject/${id}`,
        { cache: 'no-store' });

    if (res.status !== 200)
        return undefined;
    return res.json();
}

export const getProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/getProjects`,
        { cache: 'no-store' });

    if (res.status !== 200)
        return undefined;

    return res.json();
}

export const createProject = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/createProject`, {
        method: 'POST',
        body: form
    });
    if (res.status !== 200)
        return undefined;

    return res.json();
}

export const updateProject = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/updateProject`, {
        method: 'POST',
        body: form,
        cache: 'no-store'
    });

    if (res.status !== 200)
        return undefined;

    return res.json();
}

export const deleteProject = async (projectId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/deleteProject/${projectId}`, {
        method: 'POST',
        cache: 'no-store'
    });

    if (res.status !== 200)
        return undefined;

    return res.json();
}