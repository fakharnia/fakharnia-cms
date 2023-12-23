"use server"

import { revalidatePath } from 'next/cache'
import { updateStatus } from "@/lib/status.lib";

export const submit = async (form) => {
    const result = await updateStatus(form);
    
    revalidatePath('/');
    return result;
}

