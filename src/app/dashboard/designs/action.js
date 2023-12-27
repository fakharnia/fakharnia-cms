import { createDesign, updateDesign, getDesign, deleteDesign, getDesigns } from "@/lib/design.lib";

export const getsAction = async () => {
    return await getDesigns();
}

export const getAction = async (designId) => {
    return await getDesign(designId);
}

export const createAction = async (form) => {
    return await createDesign(form);
}

export const updateAction = async (form) => {
    return await updateDesign(form);
}

export const deleteAction = async (designId) => {
    return await deleteDesign(designId);
}
