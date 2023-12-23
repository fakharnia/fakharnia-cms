"use server"

import { revalidatePath } from 'next/cache'
import { createProject, updateProject } from "@/lib/project.lib";


export const create = async (form) => {
    const result = await createProject(form);

    revalidatePath('/');
    return result;
}

export const update = async (form) => {
    const result = await updateProject(form);

    revalidatePath('/');
    return result;

}

