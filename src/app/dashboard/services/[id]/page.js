"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../../page.module.css";
import formStyles from "../../styles/form.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../../context/messageContext";
import { createAction, getAction, updateAction } from "../action";

export const Form = ({ params }) => {

    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;
    const router = useRouter();

    const { addMessage, cancel } = useDashboardMessage();
    const { changeMenu } = useMenu();

    // Form properties
    const [_id, setId] = useState();
    const [fa_title, setFa_title] = useState({ value: "", error: "" });
    const [en_title, setEn_title] = useState({ value: "", error: "" });
    const [deu_title, setDeu_title] = useState({ value: "", error: "" });
    const [priority, setPriority] = useState({ value: null, error: "" });
    const [fa_fileUrl, setFa_fileUrl] = useState({ value: "", error: "" });
    const [en_fileUrl, setEn_fileUrl] = useState({ value: "", error: "" });
    const [deu_fileUrl, setDeu_fileUrl] = useState({ value: "", error: "" });
    const [coverUrl, setCoverUrl] = useState({ value: "", error: "" });
    const [coverAlt, setCoverAlt] = useState("");
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");

    const [fa_file, setFa_file] = useState("");
    const [en_file, setEn_file] = useState("");
    const [deu_file, setDeu_file] = useState("");
    const [fa_fileChanged, setFa_fileChanged] = useState(false);
    const [en_fileChanged, setEn_fileChanged] = useState(false);
    const [deu_fileChanged, setDeu_fileChanged] = useState(false);

    const [mode, setMode] = useState("create");

    const [fa_metatagTitle, setFa_metatagTitle] = useState({ value: "", error: "" });
    const [en_metatagTitle, setEn_metatagTitle] = useState({ value: "", error: "" });
    const [fa_metatagDescription, setFa_metatagDescription] = useState({ value: "", error: "" });
    const [en_metatagDescription, setEn_metatagDescription] = useState({ value: "", error: "" });


    const fetchService = async () => {
        const response = await getAction(params.id);

        setId(response?._id ?? "");
        setFa_title({ value: response?.fa_title ?? "", error: "" });
        setEn_title({ value: response?.en_title ?? "", error: "" });
        setDeu_title({ value: response?.deu_title ?? "", error: "" });
        setPriority({ value: response?.priority ?? "", error: "" });
        setFa_fileUrl({ value: response?.fa_fileUrl ?? "", error: "" });
        setEn_fileUrl({ value: response?.en_fileUrl ?? "", error: "" });
        setDeu_fileUrl({ value: response?.deu_fileUrl ?? "", error: "" });
        setCoverAlt(response?.coverAlt ?? "");
        setPreview(response?.coverUrl ? `${previewURL}/service/${response?.coverUrl}` : "");
        setCoverUrl({ value: response?.coverUrl, error: "" });
        setSelectedFile("");
        setMode(response?._id ? "edit" : "create");

        setFa_metatagTitle({ value: response?.fa_metatag_title, error: "" });
        setEn_metatagTitle({ value: response?.en_metatag_title, error: "" });
        setFa_metatagDescription({ value: response?.fa_metatag_description, error: "" });
        setEn_metatagDescription({ value: response?.en_metatag_description, error: "" });

    }

    useEffect(() => {
        if (params.id !== '0') {
            fetchService();
        }
        changeMenu("/dashboard/designs");
    }, [])

    const onCoverFileChanged = (event) => {
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

    const onFaFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFa_file(file);
            setFa_fileUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            if (mode === "edit" && _id) {
                setFa_fileChanged(true);
            }
        }
    };
    const onEnFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEn_file(file);
            setEn_fileUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            if (mode === "edit" && _id) {
                setEn_fileChanged(true);
            }
        }
    };
    const onDeuFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDeu_file(file);
            setDeu_fileUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            if (mode === "edit" && _id) {
                setDeu_fileChanged(true);
            }
        }
    };

    const formValidation = () => {
        let result = true;
        if (fa_title.value?.length === 0) {
            result = false;
            setFa_title({ ...fa_title, error: "Title required!" });
        }
        if (en_title.value?.length === 0) {
            result = false;
            setEn_title({ ...en_title, error: "Title required!" });
        }
        if (priority.value === null) {
            result = false;
            setPriority({ ...priority, error: "Priority required!" });
        }
        if (fa_fileUrl.value?.length === 0) {
            result = false;
            setFa_fileUrl({ ...fa_fileUrl, error: "Farsi Content required!" });
        }
        if (en_fileUrl.value?.length === 0) {
            result = false;
            setEn_fileUrl({ ...fa_fileUrl, error: "English Content required!" });
        }

        if (coverUrl.value?.length === 0) {
            result = false;
            setCoverUrl({ ...coverUrl, error: "Cover required!" });
        }
        if (!fa_metatagTitle.value || fa_metatagTitle.value.length === 0) {
            result = false;
            setFa_metatagTitle({ ...fa_metatagTitle, error: "Farsi Metatag Title required!" });
        }
        if (!en_metatagTitle.value || en_metatagTitle.value.length === 0) {
            result = false;
            setEn_metatagTitle({ ...en_metatagTitle, error: "English Metatag Title required!" });
        }
        if (!fa_metatagDescription.value || fa_metatagDescription.value.length === 0) {
            result = false;
            setFa_metatagDescription({ ...fa_metatagDescription, error: "Farsi Metatag Description required!" });
        }
        if (!en_metatagDescription.value || en_metatagDescription.value.length === 0) {
            result = false;
            setEn_metatagDescription({ ...en_metatagDescription, error: "English Metatag Description required!" });
        }
        return result;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id ?? null);
            form.append("fa_title", fa_title.value ?? null);
            form.append("en_title", en_title.value ?? null);
            form.append("deu_title", deu_title.value ?? null);
            form.append("priority", priority.value ?? null);
            form.append("fa_fileUrl", fa_fileUrl.value ?? null);
            form.append("en_fileUrl", en_fileUrl.value ?? null);
            form.append("deu_fileUrl", deu_fileUrl.value ?? null);

            form.append("fa_fileChanged", fa_fileChanged ? true : false);
            form.append("en_fileChanged", en_fileChanged ? true : false);
            form.append("deu_fileChanged", deu_fileChanged ? true : false);
            form.append("coverUrl", coverUrl.value ?? null);
            form.append("coverAlt", coverAlt ?? null);
            form.append("coverChanged", selectedFile ? true : false);
            form.append('cover', selectedFile ?? null);
            form.append("fa_file", fa_file);
            form.append("en_file", en_file);
            form.append("deu_file", deu_file);

            form.append("fa_metatag_title", fa_metatagTitle.value);
            form.append("en_metatag_title", en_metatagTitle.value);
            form.append("fa_metatag_description", fa_metatagDescription.value);
            form.append("en_metatag_description", en_metatagDescription.value);

            try {
                const result = mode === "create" ? await createAction(form) : await updateAction(form);

                if (result !== undefined) {
                    addMessage({ text: "Service Successfully Created", type: "message", cancel: cancel });
                    changeMenu("/dashboard/services");
                    router.push("/dashboard/services");
                } else {
                    addMessage({ text: "Operation Failed!", okText: "OK", ok: cancel });
                }

            } catch (error) {
                addMessage({ text: "Connection to server failed!", type: "error", cancel: cancel });
            }
        }
    }

    return (
        <>
            <title>Fakharnai CM | Services/Form</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Create'} Service</h5>
                    <Link className={commonStyles.pageAddButton} href="/dashboard/services">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Farsi Title *</label>
                        <input type="text" className={formStyles.formControl} value={fa_title.value} onChange={(e) => setFa_title({ value: e.target.value, error: "" })} />
                        {fa_title.error ? <small className={formStyles.formControlError}>{fa_title.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>English Title *</label>
                        <input type="text" className={formStyles.formControl} value={en_title.value} onChange={(e) => setEn_title({ value: e.target.value, error: "" })} />
                        {en_title.error ? <small className={formStyles.formControlError}>{en_title.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Deutsch Title</label>
                        <input type="text" className={formStyles.formControl} value={deu_title.value} onChange={(e) => setDeu_title({ value: e.target.value, error: "" })} />
                        {deu_title.error ? <small className={formStyles.formControlError}>{deu_title.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>Farsi Content *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onFaFileChanged} />
                            <i className={formStyles.uploadText}>{fa_fileUrl.value ? fa_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {fa_fileUrl.error ? <small className={formStyles.formControlError}>{fa_fileUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>English Content *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onEnFileChanged} />
                            <i className={formStyles.uploadText}>{en_fileUrl.value ? en_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {en_fileUrl.error ? <small className={formStyles.formControlError}>{en_fileUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>Deutsch Content</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onDeuFileChanged} />
                            <i className={formStyles.uploadText}>{deu_fileUrl.value ? deu_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {deu_fileUrl.error ? <small className={formStyles.formControlError}>{deu_fileUrl.error}</small> : null}
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority *</label>
                        <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, error: "" })} />
                        {priority.error ? <small className={formStyles.formControlError}>{priority.error}</small> : null}
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
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onCoverFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        {coverUrl.error ? <small className={formStyles.formControlError}>{coverUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Cover Alt</label>
                        <input type="text" className={formStyles.formControl} value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Persian Metatag Title *</label>
                        <input type="text" className={formStyles.formControl} value={fa_metatagTitle.value} onChange={(e) => setFa_metatagTitle({ value: e.target.value, error: "" })} />
                        {fa_metatagTitle.error ? <small className={formStyles.formControlError}>{fa_metatagTitle.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>English Metatag Title *</label>
                        <input type="text" className={formStyles.formControl} value={en_metatagTitle.value} onChange={(e) => setEn_metatagTitle({ value: e.target.value, error: "" })} />
                        {en_metatagTitle.error ? <small className={formStyles.formControlError}>{en_metatagTitle.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Persian Metatag Description *</label>
                        <input type="text" className={formStyles.formControl} value={fa_metatagDescription.value} onChange={(e) => setFa_metatagDescription({ value: e.target.value, error: "" })} />
                        {fa_metatagDescription.error ? <small className={formStyles.formControlError}>{fa_metatagDescription.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>English Metatag Description *</label>
                        <input type="text" className={formStyles.formControl} value={en_metatagDescription.value} onChange={(e) => setEn_metatagDescription({ value: e.target.value, error: "" })} />
                        {en_metatagDescription.error ? <small className={formStyles.formControlError}>{en_metatagDescription.error}</small> : null}
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