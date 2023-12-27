import { createService, deleteService, getService, getServices, updateService } from "@/lib/service.lib";

export const getAction = async (serviceId) => {
    return getService(serviceId);
}

export const getsAction = async () => {
    return await getServices();
}

export const createAction = async (form) => {
    return await createService(form);
}

export const updateAction = async (form) => {
    return await updateService(form);
}

export const deleteAction = async (serviceId) => {
    return await deleteService(serviceId);
}
