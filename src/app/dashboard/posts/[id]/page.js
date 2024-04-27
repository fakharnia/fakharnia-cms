"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../../page.module.css";
import formStyles from "../../styles/form.module.css";
import componentStyles from "../page.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../../context/messageContext";
import { createAction, getAction, updateAction } from "../action";
import { InnerForm } from "./innerForm";

export const Form = ({ params }) => {

    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;
    const router = useRouter();

    const { addMessage, cancel } = useDashboardMessage();
    const { changeMenu } = useMenu();

    const [innerForm, setInnerForm] = useState(false);
    const [mode, setMode] = useState("create");

    // Form properties
    const [_id, setId] = useState();
    const [fa_title, setFa_title] = useState({ value: "", error: "" });
    const [en_title, setEn_title] = useState({ value: "", error: "" });
    const [deu_title, setDeu_title] = useState({ value: "", error: "" });
    const [coverUrl, setCoverUrl] = useState({ value: "", error: "" });
    const [fa_fileUrl, setFa_fileUrl] = useState({ value: "", error: "" });
    const [en_fileUrl, setEn_fileUrl] = useState({ value: "", error: "" });
    const [deu_fileUrl, setDeu_fileUrl] = useState({ value: "", error: "" });
    const [estimateTimeInMinutes, setEstimateTimeInMinutes] = useState({ value: 0, errors: "" });
    const [tags, setTags] = useState({ value: [], error: "" });
    const [coverAlt, setCoverAlt] = useState("");
    const [preview, setPreview] = useState(null);
    const [fa_file, setFa_file] = useState("");
    const [en_file, setEn_file] = useState("");
    const [deu_file, setDeu_file] = useState("");
    const [cover, setCover] = useState("");

    const [coverChanged, setCoverChanged] = useState(false);
    const [fa_fileChanged, setFa_fileChanged] = useState(false);
    const [en_fileChanged, setEn_fileChanged] = useState(false);
    const [deu_fileChanged, setDeu_fileChanged] = useState(false);


    const fetchService = async () => {
        const response = await getAction(params.id);

        setId(response._id);
        setFa_title({ value: response?.fa_title, error: "" });
        setEn_title({ value: response?.en_title, error: "" });
        setDeu_title({ value: response?.deu_title, error: "" });
        setCoverUrl({ value: response?.coverUrl, error: "" });
        setFa_fileUrl({ value: response?.fa_fileUrl, error: "" });
        setEn_fileUrl({ value: response?.en_fileUrl, error: "" });
        setDeu_fileUrl({ value: response?.deu_fileUrl, error: "" });
        setEstimateTimeInMinutes({ value: response?.estimateTimeInMinutes, error: "" });
        setTags({ value: response?.tags, error: "" });
        setCoverAlt(response?.coverAlt);
        setPreview(response?.coverUrl ? `${previewURL}/post/${response._id}/${response?.coverUrl}` : "");
        setMode(response?._id ? "edit" : "create");
    }

    useEffect(() => {
        if (params.id !== '0') {
            fetchService();
        }
        changeMenu("/dashboard/posts");
    }, [])

    const onInnerFormSubmitted = (tag) => {
        setTags({ value: [...tags.value, tag], error: "" });
        setInnerForm(false);
    }

    const onRemovedTag = (eventData) => {
        const clonTags = tags.value.filter(tag => tag !== eventData);
        setTags({ value: clonTags, error: "" });

    }

    const onCoverChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCover(file);
            setCoverUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            if (mode === "edit" && _id) {
                setCoverChanged(true);
            }
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
            setFa_itle({ ...fa_title, error: "Title required!" });
        }
        if (en_title.value?.length === 0) {
            result = false;
            setEn_title({ ...en_title, error: "Title required!" });
        }
        if (!fa_fileUrl.value) {
            result = false;
            setFa_fileUrl({ ...fa_fileUrl, error: "Upload Farsi version of post!" });
        }
        if (!en_fileUrl.value) {
            result = false;
            setEn_fileUrl({ ...en_fileUrl, error: "Upload English version of post!" });
        }
        if (!coverUrl.value) {
            result = false;
            setCoverUrl({ ...coverUrl, error: "Cover required!" });
        }
        if (tags.value?.length === 0) {
            result = false;
            setTags({ ...tags, error: "Tags required!" });
        }
        if (estimateTimeInMinutes <= 0 || !estimateTimeInMinutes) {
            result = false;
            setEstimateTimeInMinutes({ estimateTimeInMinutes, error: "Enter Estimate Time" })
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
            form.append("tags", JSON.stringify(tags.value) ?? null);
            form.append("coverUrl", coverUrl.value ?? null);
            form.append("fa_fileUrl", fa_fileUrl.value ?? null);
            form.append("en_fileUrl", en_fileUrl.value ?? null);
            form.append("deu_fileUrl", deu_fileUrl.value ?? null);
            form.append("estimateTimeInMinutes", estimateTimeInMinutes.value ?? 0);
            form.append("coverAlt", coverAlt ?? null);
            form.append("coverChanged", coverChanged ? true : false);
            form.append("fa_fileChanged", fa_fileChanged ? true : false);
            form.append("en_fileChanged", en_fileChanged ? true : false);
            form.append("deu_fileChanged", deu_fileChanged ? true : false);
            form.append("cover", cover);
            form.append("fa_file", fa_file);
            form.append("en_file", en_file);
            form.append("deu_file", deu_file);

            try {
                const result = mode === "create" ? await createAction(form) : await updateAction(form);

                if (result !== undefined) {
                    addMessage({ text: "Service Successfully Created", type: "message", cancel: cancel });
                    changeMenu("/dashboard/posts");
                    router.push("/dashboard/posts");
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
                    <Link className={commonStyles.pageAddButton} href="/dashboard/posts">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Persian Title *</label>
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
                        <label className={formStyles.uploadLabel}>Farsi version *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onFaFileChanged} />
                            <i className={formStyles.uploadText}>{fa_fileUrl.value ? fa_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {fa_fileUrl.error ? <small className={formStyles.formControlError}>{fa_fileUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>English version *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onEnFileChanged} />
                            <i className={formStyles.uploadText}>{en_fileUrl.value ? en_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {en_fileUrl.error ? <small className={formStyles.formControlError}>{en_fileUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>Deutsch version</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept=".mdx" onChange={onDeuFileChanged} />
                            <i className={formStyles.uploadText}>{deu_fileUrl.value ? deu_fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {deu_fileUrl.error ? <small className={formStyles.formControlError}>{deu_fileUrl.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Estimate Time (minutes)</label>
                        <input type="number" className={formStyles.formControl} value={estimateTimeInMinutes.value} onChange={(e) => setEstimateTimeInMinutes({ value: +e.target.value, error: "" })} />
                    </div>
                    <h5 className={formStyles.formSectionTitle}>Tags *</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Tag" : "Add Tag"}</button>
                    {innerForm ? <InnerForm onSubmit={onInnerFormSubmitted} /> : null}
                    <ul className={componentStyles.postTagsList}>
                        {tags.value.map((tag, index) => <li key={index} onClick={() => { onRemovedTag(tag) }}>{tag}</li>)}
                    </ul>
                    <div className={formStyles.formGroup}>
                        {tags.error ? <small className={formStyles.formControlError}>At least one tag required!</small> : null}
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
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onCoverChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        {coverUrl.error ? <small className={formStyles.formControlError}>{coverUrl.error}</small> : null}
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