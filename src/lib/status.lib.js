export const getStatus = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/status/getStatus`,
        { cache: 'no-store' });
    if (!res.ok)
        return undefined;

    const status = res.json();

    return status;
}

export const updateStatus = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/status/updateStatus`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}