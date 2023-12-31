import { getResume, updateResume } from "@/lib/resume.lib";

export const getAction = async (serviceId) => {
    return getResume(serviceId);
}

export const updateAction = async (form) => {
    return await updateResume(form);
}
