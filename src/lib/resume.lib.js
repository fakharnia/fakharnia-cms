export const getResume = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/resume/getResume`,
        { cache: 'no-store' });
    if (!res.ok)
        return undefined;

    const status = res.json();

    return status;
}

export const updateResume = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/resume/updateResume`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}