"use server"
import { createDesign, updateDesign, getDesign } from "@/lib/design.lib";
import { revalidatePath } from 'next/cache'


export const create = async (form) => {
    const result = await createDesign(form);

    revalidatePath('/');
    return result;
}

export const update = async (form) => {
    const result = await updateDesign(form);

    revalidatePath('/');
    return result;

}
