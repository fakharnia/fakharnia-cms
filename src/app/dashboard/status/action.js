import { updateStatus } from "@/lib/status.lib";

export const updateAction = async (form) => {
    const result = await updateStatus(form);
    return result;
}

