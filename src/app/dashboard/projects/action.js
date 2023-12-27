import { createProject, deleteProject, getProject, getProjects, updateProject } from "@/lib/project.lib";

export const getAction = async (projectId) => {
    return await getProject(projectId);
}

export const getsAction = async () => {
    return await getProjects();
}

export const createAction = async (form) => {
    return await createProject(form);
}

export const updateAction = async (form) => {
    return await updateProject(form);
}

export const deleteAction = async (projectId) => {
    return await deleteProject(projectId);
}