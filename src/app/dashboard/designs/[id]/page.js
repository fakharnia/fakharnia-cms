"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import styles from "../../page.module.css";
import formStyles from "../../styles/form.module.css";
import designStyles from "../page.module.css";
import InnerForm from "./innerForm";

import { useMessage } from "@/app/context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { create, update, gets } from "./action";
import { getDesign } from "@/lib/design.lib";

export const Form = ({ params }) => {
    const { addMessage, cancel } = useMessage();
    const { changeMenu } = useMenu();
    const router = useRouter();
    const previewURL = process.env.NEXT_PUBLIC_API;

    const [mode, setMode] = useState("create");
    const [innerForm, setInnerForm] = useState(false);

    const [_id, setId] = useState("");
    const [title, setTitle] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: "", error: "" });
    const [images, setImages] = useState({ value: [], error: "" });
    const [deletedImages, setDeletedImages] = useState([]);

    const fetchDesign = async () => {
        const response = await getDesign(params.id)
        setId(response?._id ?? "");
        setTitle({ value: response?.title ?? "", error: "" });
        setPriority({ value: response?.priority ?? "", error: "" });
        setDescription({ value: response?.description ?? "", error: "" });
        setImages({ value: response?.images ?? [], error: "" });
        setMode(response?._id ? "edit" : "create");
    }

    useEffect(() => {
        if (params.id !== '0') {
            fetchDesign();
        }
    }, [])

    const deleteImageHandler = (eventData) => {
        setImages({ value: images.value.filter(img => JSON.stringify(img) !== JSON.stringify(eventData)), error: "" });
        if (mode === "edit") {
            setDeletedImages([...deletedImages, eventData]);
        }
    }

    const handleImageData = (file) => {
        setImages({ value: [...images.value, file], error: "" });
        setInnerForm(false);
    }

    const formValidation = () => {
        let result = true;

        return result;
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id ?? null);
            form.append("title", title.value ?? null);
            form.append("description", description.value ?? null);
            form.append("priority", priority.value ?? null);
            const imagesData = images.value.map(img => ({ _id: img._id, priority: img.priority, fileAlt: img.fileAlt, fileUrl: img.fileUrl, isCover: img.isCover }));
            form.append("imagesData", JSON.stringify(imagesData))
            form.append("deletedImages", JSON.stringify(deletedImages));
            images.value.forEach((img, index) => {
                if (img.file) {
                    form.append(`images`, img.file);
                }
            });
            if (mode === "edit") {
                await update(form);
            } else {
                await create(form);
            }

            addMessage({ text: "Service Successfully Created", okText: "OK", ok: cancel });
            changeMenu("/dashboard/designs");
            router.push("/dashboard/designs");
        }
    }

    return (
        <>
            <title>Fakharnai CM | Projects/{mode === 'edit' ? 'Edit' : 'Define'}</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Define'} UI</h5>
                    <Link className={styles.pageAddButton} href="/dashboard/designs">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitHandler}>
                    <div className={formStyles.formGroup}>
                        <label className={title.error ? formStyles.formLabelError : formStyles.formLabel}>Title *</label>
                        <input type="text" className={formStyles.formControl} value={title.value} onChange={(e) => setTitle({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{title.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={description.error.length ? formStyles.formLabelError : formStyles.formLabel}>Description *</label>
                        <textarea className={formStyles.formControl} value={description.value} onChange={(e) => setDescription({ value: e.target.value, error: "" })} ></textarea>
                        <small className={formStyles.formControlError}>{description.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority *</label>
                        <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, errors: [] })} />
                    </div>
                    <h5 className={formStyles.formSectionTitle}>Images</h5>
                    <button type="button" className={styles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Image" : "Add Image"}</button>
                    <div className={designStyles.imagesList}>
                        {
                            images.value.map(image => (
                                <div className={designStyles.imageEl}>
                                    <Image width={200} height={190} src={image.preview ?? `${previewURL}/public/design/${image?.fileUrl}`} alt={image.fileAlt}
                                        onClick={() => deleteImageHandler(image)} />
                                    {image.isCover ? <i className={designStyles.isCover}></i> : ""}
                                </div>
                            ))
                        }
                    </div>
                    {innerForm ? <InnerForm dataHandler={handleImageData} /> : ''}
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form >
            </div >
        </>
    )

}

export default Form;