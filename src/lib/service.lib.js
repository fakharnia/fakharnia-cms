export const getServices = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/getServices`,
        { cache: 'no-store' });

    if (!res.ok)
        return undefined;

    return res.json();

}

export const getService = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/getService/${id}`,
        { cache: 'no-store' });

    if (!res.ok)
        return undefined;

    return res.json();

}

export const createService = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/createService`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}

export const updateService = async (form) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/updateService`, {
        method: 'POST',
        body: form
    });

    if (!res.ok)
        return undefined;

    return res.json();
}

export const deleteService = async (serviceId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/service/deleteService/${serviceId}`, {
        method: 'POST',
        cache: 'no-store'
    });

    if (res.status !== 200)
        return undefined;

    return res.json();
}