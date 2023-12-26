export const getDesigns = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/design/getDesigns`,
        { cache: 'no-store' });

    if (!res.ok)
        return undefined;

    return res.json();

}

export const getDesign = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/design/getDesign/${id}`,
        { cache: 'no-store' });

    if (!res.ok)
        return undefined;

    return res.json();

}

export const createDesign = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/design/createDesign`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}

export const updateDesign = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/design/updateDesign`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}

export const deleteDesign = async (designId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/design/deleteDesign/${designId}`, {
        method: 'POST',
        cache: 'no-store'
    });

    if (res.status !== 200)
        return undefined;

    return res.json();
}