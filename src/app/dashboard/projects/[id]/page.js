"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../../page.module.css";
import componentStyles from "../page.module.css";
import formStyles from "../../styles/form.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../../context/messageContext";
import { getProject } from "@/lib/project.lib";
import { createAction, updateAction } from "../action";
import { InnerForm } from "./innerForm";

export const ProjectForm = ({ params }) => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;
    const router = useRouter();

    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useDashboardMessage();

    const [innerForm, setInnerForm] = useState(false);
    const [mode, setMode] = useState("create");

    const [_id, setId] = useState("");
    const [fa_name, setFa_name] = useState({ value: "", error: "" });
    const [en_name, setEn_name] = useState({ value: "", error: "" });
    const [deu_name, setDeu_name] = useState({ value: "", error: "" });
    const [key, setKey] = useState({ value: "", error: "" });
    const [fa_description, setFa_description] = useState({ value: "", error: "" });
    const [en_description, setEn_description] = useState({ value: "", error: "" });
    const [deu_description, setDeu_description] = useState({ value: "", error: "" });
    const [logoAlt, setLogoAlt] = useState("");
    const [fa_techDescription, setFa_techDescription] = useState({ value: "", error: "" });
    const [en_techDescription, setEn_techDescription] = useState({ value: "", error: "" });
    const [deu_techDescription, setDeu_techDescription] = useState({ value: "", error: "" });

    const [priority, setPriority] = useState("");
    const [url, setUrl] = useState("");
    const [lightLogoUrl, setLightLogoUrl] = useState("");
    const [darkLogoUrl, setDarkLogoUrl] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [lightPreview, setLightPreview] = useState("");
    const [darkPreview, setDarkPreview] = useState("");
    const [selectedLightFile, setSelectedLightFile] = useState(null);
    const [selectedDarkFile, setSelectedDarkFile] = useState(null);

    const [fa_metatagTitle, setFa_metatagTitle] = useState({ value: "", error: "" });
    const [en_metatagTitle, setEn_metatagTitle] = useState({ value: "", error: "" });
    const [fa_metatagDescription, setFa_metatagDescription] = useState({ value: "", error: "" });
    const [en_metatagDescription, setEn_metatagDescription] = useState({ value: "", error: "" });


    const fetchProject = async () => {
        const response = await getProject(params.id);;
        setMode(response?._id ? "edit" : "create");

        setId(response?._id ?? "");
        setFa_name({ value: response?.fa_name ?? "", error: "" });
        setEn_name({ value: response?.en_name ?? "", error: "" });
        setDeu_name({ value: response?.deu_name ?? "", error: "" });
        setKey({ value: response?.key ?? "", error: "" });
        setPriority(response?.priority ?? "");
        setFa_description({ value: response?.fa_description ?? "", error: "" });
        setEn_description({ value: response?.en_description ?? "", error: "" });
        setDeu_description({ value: response?.deu_description ?? "", error: "" });
        setUrl(response?.url ?? "");
        setLogoAlt(response?.logoAlt ?? "");
        setFa_techDescription({ value: response?.fa_techDescription ?? "", error: "" });
        setEn_techDescription({ value: response?.en_techDescription ?? "", error: "" });
        setDeu_techDescription({ value: response?.deu_techDescription ?? "", error: "" });

        setTechnologies(response?.technologies ?? []);
        setLightLogoUrl(response?.lightLogoUrl ?? null);
        setLightPreview(response?.lightLogoUrl ? `${previewURL}/project/${response?.lightLogoUrl}` : null);
        setDarkLogoUrl(response?.darkLogoUrl ?? null);
        setDarkPreview(response?.darkLogoUrl ? `${previewURL}/project/${response?.darkLogoUrl}` : null);
        setSelectedLightFile(null);
        setSelectedDarkFile(null);

        setFa_metatagTitle({ value: response?.fa_metatag_title, error: "" });
        setEn_metatagTitle({ value: response?.en_metatag_title, error: "" });
        setFa_metatagDescription({ value: response?.fa_metatag_description, error: "" });
        setEn_metatagDescription({ value: response?.en_metatag_description, error: "" });

    }

    useEffect(() => {
        if (params.id !== "0") {
            fetchProject();
        }
        changeMenu("/dashboard/projects");
    }, []);

    const onInnerFormSubmitted = (tech) => {
        setTechnologies([...technologies, tech]);
        setInnerForm(false);
    }

    const onLightFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedLightFile(file);
            setLightLogoUrl(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLightPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDarkFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedDarkFile(file);
            setDarkLogoUrl(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setDarkPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onRemovedTechnology = (tech) => {
        setTechnologies([...technologies.filter(t => t.name !== tech.name)]);
    }

    const formValidation = () => {
        let result = true;
        if (fa_name.value.length === 0) {
            setFa_name({ ...fa_name, error: "Enter the project name" });
            result = false;
        }
        if (en_name.value.length === 0) {
            setEn_name({ ...en_name, error: "Enter the project name" });
            result = false;
        }
        if (key.value.length === 0) {
            setKey({ ...key, error: "Enter the project key" });
            result = false;
        }
        if (fa_description.value.length === 0) {
            setFa_description({ ...fa_description, error: "Enter the project Domain and Main Problem" });
            result = false;
        }
        if (en_description.value.length === 0) {
            setEn_description({ ...en_description, error: "Enter the project Domain and Main Problem" });
            result = false;
        }
        if (fa_techDescription.value.length === 0) {
            setFa_techDescription({ ...fa_techDescription, error: "Enter the project Technologies Description" });
            result = false;
        }
        if (en_techDescription.value.length === 0) {
            setEn_techDescription({ ...en_techDescription, error: "Enter the project Technologies Description" });
            result = false;
        }
        if (lightLogoUrl.length === 0) {
            result = false;
        }
        if (darkLogoUrl.length === 0) {
            result = false;
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

    const onChangeController = (propertyName, value) => {
        switch (propertyName) {
            case "fa_name":
                setFa_name({ value: value, error: "" });
                if (value.length === 0) {
                    setFa_name({ value: value, error: "Enter the project name (Farsi)" });
                }
                break;
            case "en_name":
                setEn_name({ value: value, error: "" });
                if (value.length === 0) {
                    setEn_name({ value: value, error: "Enter the project name (English)" });
                }
                break;
            case "deu_name":
                setDeu_name({ value: value, error: "" });
                break;
            case "key":
                setKey({ value: value, error: "" });
                if (value.length === 0) {
                    setKey({ value: value, error: "Enter the project key" });
                }
                break;
            case "fa_description":
                setFa_description({ value: value, error: "" });
                if (value.length === 0) {
                    setFa_description({ value: value, error: "Enter the project Domain and Main Problem (Farsi)" });
                }
                break;
            case "en_description":
                setEn_description({ value: value, error: "" });
                if (value.length === 0) {
                    setEn_description({ value: value, error: "Enter the project Domain and Main Problem (English)" });
                }
                break;
            case "deu_description":
                setDeu_description({ value: value, error: "" });
                break;

            case "fa_techDescription":
                setFa_techDescription({ value: value, error: "" });
                if (value.length === 0) {
                    setFa_techDescription({ value: value, error: "Enter the project Technologies Description (Farsi)" });
                }
                break;
            case "en_techDescription":
                setEn_techDescription({ value: value, error: "" });
                if (value.length === 0) {
                    setEn_techDescription({ value: value, error: "Enter the project Technologies Description (English)" });
                }
                break;
            case "deu_techDescription":
                setDeu_techDescription({ value: value, error: "" });
                break;
            case "fa_metatagTitle":
                setFa_metatagTitle({ value: value, error: "" });
                break;
            case "en_metatagTitle":
                setEn_metatagTitle({ value: value, error: "" });
                break;
            case "fa_metatagDescription":
                setFa_metatagDescription({ value: value, error: "" });
                break;
            case "en_metatagDescription":
                setEn_metatagDescription({ value: value, error: "" });
                break;
        }
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id);
            form.append("fa_name", fa_name.value ?? null);
            form.append("en_name", en_name.value ?? null);
            form.append("deu_name", deu_name.value ?? null);
            form.append("key", key.value ?? null);
            form.append("priority", priority);
            form.append("fa_description", fa_description.value ?? null);
            form.append("en_description", en_description.value ?? null);
            form.append("deu_description", deu_description.value ?? null);
            form.append("url", url);
            form.append("fa_techDescription", fa_techDescription.value ?? null);
            form.append("en_techDescription", en_techDescription.value ?? null);
            form.append("deu_techDescription", deu_techDescription.value ?? null);
            form.append("logoAlt", logoAlt);

            form.append("technologies", JSON.stringify(technologies) ?? []);
            form.append("lightLogoUrl", lightLogoUrl ?? null);
            form.append("darkLogoUrl", darkLogoUrl ?? null);
            form.append('lightLogo', selectedLightFile ?? null);
            form.append('darkLogo', selectedDarkFile ?? null);
            form.append("lightLogoChanged", selectedLightFile ? true : false);
            form.append("darkLogoChanged", selectedDarkFile ? true : false);

            form.append("fa_metatag_title", fa_metatagTitle.value);
            form.append("en_metatag_title", en_metatagTitle.value);
            form.append("fa_metatag_description", fa_metatagDescription.value);
            form.append("en_metatag_description", en_metatagDescription.value);


            try {
                const result = mode === "create" ? await createAction(form) : await updateAction(form);

                if (result !== undefined) {
                    addMessage({ text: "Service Successfully Created", cancel: cancel, type: "message" });
                    changeMenu("/dashboard/projects");
                    router.push("/dashboard/projects");
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
                    <h5 className={commonStyles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Define'} Project</h5>
                    <Link className={commonStyles.pageAddButton} href="/dashboard/projects">Back</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>

                    {/* Name */}
                    <div className={formStyles.formGroup}>
                        <label className={fa_name.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Farsi Name *</label>
                        <input type="text" className={formStyles.formControl} value={fa_name.value} onChange={(e) => onChangeController("fa_name", e.target.value)} />
                        {fa_name.error ? <small className={formStyles.formControlError}>{fa_name.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={en_name.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>English Name *</label>
                        <input type="text" className={formStyles.formControl} value={en_name.value} onChange={(e) => onChangeController("en_name", e.target.value)} />
                        {en_name.error ? <small className={formStyles.formControlError}>{en_name.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={deu_name.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Deutsch Name</label>
                        <input type="text" className={formStyles.formControl} value={deu_name.value} onChange={(e) => onChangeController("deu_name", e.target.value)} />
                        {deu_name.error ? <small className={formStyles.formControlError}>{deu_name.error}</small> : null}
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={key.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Key *</label>
                        <input type="text" className={formStyles.formControl} value={key.value} onChange={(e) => onChangeController("key", e.target.value)} />
                        {key.error ? <small className={formStyles.formControlError}>{key.error}</small> : null}
                    </div>

                    {/* Description */}
                    <div className={formStyles.formGroup}>
                        <label className={fa_description.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Domain and Main Problem in Farsi *</label>
                        <textarea className={formStyles.formControl} value={fa_description.value} onChange={(e) => onChangeController("fa_description", e.target.value)} ></textarea>
                        {fa_description.error ? <small className={formStyles.formControlError}>{fa_description.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={en_description.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Domain and Main Problem in English *</label>
                        <textarea className={formStyles.formControl} value={en_description.value} onChange={(e) => onChangeController("en_description", e.target.value)} ></textarea>
                        {en_description.error ? <small className={formStyles.formControlError}>{en_description.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={deu_description.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Domain and Main Problem in Deutsch</label>
                        <textarea className={formStyles.formControl} value={deu_description.value} onChange={(e) => onChangeController("deu_description", e.target.value)} ></textarea>
                        {deu_description.error ? <small className={formStyles.formControlError}>{deu_description.error}</small> : null}
                    </div>
                    {/* Priority */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority</label>
                        <input type="number" className={formStyles.formControl} value={priority} onChange={(e) => setPriority(e.target.value)} />
                    </div>
                    {/* Url */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>URL</label>
                        <input type="text" className={formStyles.formControl} value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>
                    {/* Logo */}
                    <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                        <label className={formStyles.formLabel}>Light Logo</label>
                        {
                            lightPreview ?
                                <Image width={100} height={100} className={formStyles.imagePreview} src={lightPreview} alt="Preview" />
                                :
                                <i className={formStyles.imagePreview}></i>
                        }
                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onLightFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                    </div>
                    <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                        <label className={formStyles.formLabel}>Dark Logo</label>
                        {
                            darkPreview ?
                                <Image width={100} height={100} className={formStyles.imagePreview} src={darkPreview} alt="Preview" />
                                :
                                <i className={formStyles.imagePreview}></i>
                        }
                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onDarkFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Logo Alt</label>
                        <input type="text" className={formStyles.formControl} value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} />
                    </div>

                    <h5 className={formStyles.formSectionTitle}>Technologies *</h5>

                    {/* Technologies Description */}
                    <div className={formStyles.formGroup}>
                        <label className={fa_techDescription.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>About Technologies (Farsi) *</label>
                        <textarea className={formStyles.formControl} value={fa_techDescription.value} onChange={(e) => onChangeController("fa_techDescription", e.target.value)} ></textarea>
                        {fa_techDescription.error ? <small className={formStyles.formControlError}>{fa_techDescription.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={en_techDescription.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>About Technologies (English) *</label>
                        <textarea className={formStyles.formControl} value={en_techDescription.value} onChange={(e) => onChangeController("en_techDescription", e.target.value)} ></textarea>
                        {en_techDescription.error ? <small className={formStyles.formControlError}>{en_techDescription.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={deu_techDescription.error.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>About Technologies (Deutsch)</label>
                        <textarea className={formStyles.formControl} value={deu_techDescription.value} onChange={(e) => onChangeController("deu_techDescription", e.target.value)} ></textarea>
                        {deu_techDescription.error ? <small className={formStyles.formControlError}>{deu_techDescription.error}</small> : null}
                    </div>

                    {/* Technologies List */}
                    <ul className={componentStyles.projectTechList}>
                        {technologies.map((tech, index) => <li key={index} onClick={() => { onRemovedTechnology(tech) }}>{tech.name}</li>)}
                    </ul>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Tech" : "Add Tech"}</button>
                    {innerForm ? <InnerForm onSubmit={onInnerFormSubmitted} /> : ''}
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

export default ProjectForm;