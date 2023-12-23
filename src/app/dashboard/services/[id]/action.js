"use server"
import { createService, updateService } from "@/lib/service.lib";
import { revalidatePath } from 'next/cache'


export const create = async (form) => {
    const result = await createService(form);

    revalidatePath('/');
    return result;
}

export const update = async (form) => {
    const result = await updateService(form);

    revalidatePath('/');
    return result;

}

