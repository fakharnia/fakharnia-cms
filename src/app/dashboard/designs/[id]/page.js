"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../../page.module.css";
import componentStyles from "../page.module.css";
import formStyles from "../../styles/form.module.css";
import { useDashboardMessage } from "../../context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { createAction, updateAction, getAction } from "../action";
import InnerForm from "./innerForm";

export const Form = ({ params }) => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;

    const { addMessage, cancel } = useDashboardMessage();
    const { changeMenu } = useMenu();
    const router = useRouter();

    const [mode, setMode] = useState("create");
    const [innerForm, setInnerForm] = useState(false);

    // Form properties
    const [_id, setId] = useState("");
    const [fa_title, setFaTitle] = useState({ value: "", error: "" });
    const [en_title, setEnTitle] = useState({ value: "", error: "" });
    const [deu_title, setDeuTitle] = useState({ value: "", error: "" });
    const [key, setKey] = useState({ value: "", error: "" });
    const [fa_description, setFaDescription] = useState({ value: "", error: "" });
    const [en_description, setEnDescription] = useState({ value: "", error: "" });
    const [deu_description, setDeuDescription] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: "", error: "" });
    const [images, setImages] = useState({ value: [], error: "" });
    const [deletedImages, setDeletedImages] = useState([]);

    const fetchDesign = async () => {
        try {
            const response = await getAction(params.id)
            setId(response?._id ?? "");
            setFaTitle({ value: response?.fa_title ?? "", error: "" });
            setEnTitle({ value: response?.en_title ?? "", error: "" });
            setDeuTitle({ value: response?.deu_title ?? "", error: "" });
            setKey({ value: response?.key ?? "", error: "" });
            setPriority({ value: response?.priority ?? "", error: "" });
            setFaDescription({ value: response?.fa_description ?? "", error: "" });
            setEnDescription({ value: response?.en_description ?? "", error: "" });
            setDeuDescription({ value: response?.deu_description ?? "", error: "" });
            setImages({ value: response?.images ?? [], error: "" });
            setMode(response?._id ? "edit" : "create");
        } catch (error) {
            addMessage({ text: "Connection to server failed!", cancel: cancel, type: "error" });
        }
    }

    useEffect(() => {
        if (params.id !== '0') {
            fetchDesign();
        }
        changeMenu("/dashboard/designs");
    }, [])

    const onInnerFormSubmitted = (file) => {
        setImages({ value: [...images.value, file], error: "" });
        setInnerForm(false);
    }

    const onDeleteImage = (eventData) => {
        setImages({ value: images.value.filter(img => JSON.stringify(img) !== JSON.stringify(eventData)), error: "" });
        if (mode === "edit") {
            setDeletedImages([...deletedImages, eventData]);
        }
    }

    const formValidation = () => {
        let result = true;

        return result;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            const imagesData = images.value.map(img => ({ _id: img._id, priority: img.priority, fileAlt: img.fileAlt, fileUrl: img.fileUrl, isCover: img.isCover }));
            form.append("_id", _id ?? null);
            form.append("fa_title", fa_title.value ?? null);
            form.append("en_title", en_title.value ?? null);
            form.append("deu_title", deu_title.value ?? null);
            form.append("key", key.value ?? null);
            form.append("fa_description", fa_description.value ?? null);
            form.append("en_description", en_description.value ?? null);
            form.append("deu_description", deu_description.value ?? null);
            form.append("priority", priority.value ?? null);
            form.append("imagesData", JSON.stringify(imagesData))
            form.append("deletedImages", JSON.stringify(deletedImages));
            images.value.forEach((img, index) => {
                if (img.file) {
                    form.append(`images`, img.file);
                }
            });

            try {
                const result = mode === "create" ? await createAction(form) : await updateAction(form);
                if (result !== undefined) {
                    addMessage({ text: "Service Successfully Created", type: "message", cancel: cancel });
                    changeMenu("/dashboard/designs");
                    router.push("/dashboard/designs");

                } else {
                    addMessage({ text: "Operation Failed!", cancel: cancel, type: "error" });
                }

            } catch (error) {
                addMessage({ text: "Connection to server failed!", type: "error", cancel: cancel });
            }
        }
    }

    return (
        <>
            <title>Fakharnai CM | Projects/{mode === 'edit' ? 'Edit' : 'Define'}</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Define'} UI</h5>
                    <Link className={commonStyles.pageAddButton} href="/dashboard/designs">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>
                    <div className={formStyles.formGroup}>
                        <label className={fa_title.error ? formStyles.formLabelError : formStyles.formLabel}>Farsi Title *</label>
                        <input type="text" className={formStyles.formControl} value={fa_title.value} onChange={(e) => setFaTitle({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{fa_title.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={en_title.error ? formStyles.formLabelError : formStyles.formLabel}>English Title *</label>
                        <input type="text" className={formStyles.formControl} value={en_title.value} onChange={(e) => setEnTitle({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{en_title.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={deu_title.error ? formStyles.formLabelError : formStyles.formLabel}>Deutsch Title</label>
                        <input type="text" className={formStyles.formControl} value={deu_title.value} onChange={(e) => setDeuTitle({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{deu_title.error}</small>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={key.error ? formStyles.formLabelError : formStyles.formLabel}>Key *</label>
                        <input type="text" className={formStyles.formControl} value={key.value} onChange={(e) => setKey({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{key.error}</small>
                    </div>


                    <div className={formStyles.formGroup}>
                        <label className={fa_description.error.length ? formStyles.formLabelError : formStyles.formLabel}>Farsi Description *</label>
                        <textarea className={formStyles.formControl} value={fa_description.value} onChange={(e) => setFaDescription({ value: e.target.value, error: "" })} ></textarea>
                        <small className={formStyles.formControlError}>{fa_description.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={en_description.error.length ? formStyles.formLabelError : formStyles.formLabel}>English Description *</label>
                        <textarea className={formStyles.formControl} value={en_description.value} onChange={(e) => setEnDescription({ value: e.target.value, error: "" })} ></textarea>
                        <small className={formStyles.formControlError}>{en_description.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={deu_description.error.length ? formStyles.formLabelError : formStyles.formLabel}>Deutsch Description</label>
                        <textarea className={formStyles.formControl} value={deu_description.value} onChange={(e) => setDeuDescription({ value: e.target.value, error: "" })} ></textarea>
                        <small className={formStyles.formControlError}>{deu_description.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority *</label>
                        <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, errors: [] })} />
                    </div>
                    <h5 className={formStyles.formSectionTitle}>Images</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Image" : "Add Image"}</button>
                    {innerForm ? <InnerForm onSubmit={onInnerFormSubmitted} /> : ''}
                    <div className={componentStyles.imagesList}>
                        {
                            images.value.map((image, index) => (
                                <div key={index} className={componentStyles.imageEl}>
                                    <Image width={200} height={190} src={image.preview ?? `${previewURL}/design/${image?.fileUrl}`} alt={image.fileAlt}
                                        onClick={() => onDeleteImage(image)} />
                                    {image.isCover ? <i className={componentStyles.isCover}>This is cover</i> : ""}
                                </div>
                            ))
                        }
                    </div>
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form >
            </div >
        </>
    )

}

export default Form;