"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import Image from "next/image";
import styles from "../../page.module.css";
import formStyles from "../../styles/form.module.css";

import { useMessage } from "@/app/context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { getService } from "@/lib/service.lib";
import { create, update } from "./action";

export const Form = ({ params }) => {

    const { addMessage, cancel } = useMessage();
    const { changeMenu } = useMenu();

    const [_id, setId] = useState();
    const [title, setTitle] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: null, error: "" });
    const [content, setContent] = useState({ value: "", error: "" });
    const [coverUrl, setCoverUrl] = useState({ value: "", error: "" });
    const [coverAlt, setCoverAlt] = useState("");
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");
    const [mode, setMode] = useState("create");

    const previewURL = process.env.NEXT_PUBLIC_API;

    const router = useRouter();

    const [service, setService] = useState([])

    const fetchService = async () => {
        const response = await getService(params.id);
        setService(response ?? []);

        setId(response?._id ?? "");
        setTitle({ value: response?.title ?? "", error: "" });
        setPriority({ value: response?.priority ?? "", error: "" });
        setContent({ value: response?.content ?? "", error: "" });
        setCoverUrl({ value: response?.coverUrl ?? "", error: "" });
        setCoverAlt(response?.coverAlt ?? "");
        setPreview(response?.coverUrl ? `${previewURL}/public/service/${response?.coverUrl}` : "");
        setSelectedFile("");
        setMode(response?._id ? "edit" : "create");
    }

    useEffect(() => {
        if (params.id !== '0') {
            fetchService();
        }
    }, [])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setCoverUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formValidation = () => {
        let result = true;
        if (title.value?.length === 0) {
            result = false;
            setTitle({ ...title, error: "Title required!" });
        }
        if (priority.value === null) {
            result = false;
            setPriority({ ...priority, error: "Priority required!" });
        }
        if (content.value?.length === 0) {
            result = false;
            setContent({ ...content, error: "Content required!" });
        }
        if (coverUrl.value?.length === 0) {
            result = false;
            setCoverUrl({ ...coverUrl, error: "Cover required!" });
        }
        return result;
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id ?? null);
            form.append("title", title.value ?? null);
            form.append("content", content.value ?? null);
            form.append("priority", priority.value ?? null);
            form.append("coverUrl", coverUrl.value ?? null);
            form.append("coverAlt", coverAlt ?? null);
            form.append('cover', selectedFile ?? null);
            form.append("coverChanged", selectedFile ? true : false);

            if (mode === "edit") {
                await update(form);
            } else {
                await create(form);
            }

            addMessage({ text: "Service Successfully Created", okText: "OK", ok: cancel });
            changeMenu("/dashboard/services");
            router.push("/dashboard/services");
        }
    }

    return (
        <>
            <title>Fakharnai CM | Services/Form</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Create'} Service</h5>
                    <Link className={styles.pageAddButton} href="/dashboard/services">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitHandler}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Title *</label>
                        <input type="text" className={formStyles.formControl} value={title.value} onChange={(e) => setTitle({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{title.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority *</label>
                        <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, error: "" })} />
                        <small className={formStyles.formControlError}>{priority.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Content *</label>
                        <textarea className={formStyles.formControl} value={content.value} onChange={(e) => setContent({ value: e.target.value, error: "" })} ></textarea>
                        <small className={formStyles.formControlError}>{content.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Content Preview</label>
                        <div className={formStyles.markdownPreview}>
                            <ReactMarkdown>{content.value}</ReactMarkdown>
                        </div>
                    </div>
                    <div className={`${formStyles.formGroup}`}>
                        <label className={formStyles.formLabel}>Cover *</label>
                        {
                            preview ?
                                <Image width={200} height={190} className={formStyles.coverImagePreview} src={preview} alt="Preview" />
                                :
                                <i className={formStyles.coverImagePreview}></i>
                        }

                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={handleFileChange} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        <small className={formStyles.formControlError}>{coverUrl.error}</small>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Cover Alt</label>
                        <input type="text" className={formStyles.formControl} value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} />
                    </div>
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )

}

export default Form;