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

    const [_id, setId] = useState({ value: "", errors: [] });
    const [name, setName] = useState({ value: "", errors: [] });
    const [priority, setPriority] = useState({ value: "", errors: [] });
    const [description, setDescription] = useState({ value: "", errors: [] });
    const [url, setUrl] = useState({ value: "", errors: [] });
    const [logoAlt, setCoverAlt] = useState({ value: "", errors: [] });
    const [techDescription, setTechDescription] = useState({ value: "", errors: [] });

    const [logoUrl, setLogoUrl] = useState("");
    const [technologies, setTechnologies] = useState([]);
    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchProject = async () => {
        const response = await getProject(params.id);;
        setMode(response?._id ? "edit" : "create");
        setId({ value: response?._id ?? "", errors: [] });
        setName({ value: response?.name ?? "", errors: [] });
        setPriority({ value: response?.priority ?? "", errors: [] });
        setDescription({ value: response?.description ?? "", errors: [] });
        setUrl({ value: response?.url ?? "", errors: [] });
        setCoverAlt({ value: response?.logoAlt ?? "", errors: [] });
        setTechDescription({ value: response?.techDescription ?? "", errors: [] });

        setTechnologies(response?.technologies ?? []);
        setLogoUrl(response?.logoUrl ?? null);
        setPreview(response?.logoUrl ? `${previewURL}/project/${response?.logoUrl}` : null);
        setSelectedFile(null);
    }

    useEffect(() => {
        if (params.id !== "0") {
            fetchProject();
        }
        changeMenu("/dashboard/designs");
    }, []);

    const onInnerFormSubmitted = (tech) => {
        setTechnologies([...technologies, tech]);
        setInnerForm(false);
    }

    const onFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setLogoUrl(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onRemovedTechnology = (tech) => {
        setTechnologies([...technologies.filter(t => t.name !== tech.name)]);
    }

    const formValidation = () => {
        let result = true;
        if (name.value.length === 0) {
            setName({ ...name, errors: ["Enter the project name"] });
            result = false;
        }
        if (description.value.length === 0) {
            setDescription({ ...description, errors: ["Enter the project Domain and Main Problem"] });
            result = false;
        }
        if (techDescription.value.length === 0) {
            setTechDescription({ ...techDescription, errors: ["Enter the project Technologies Description"] });
            result = false;
        }
        return result;
    }

    const onChangeController = (propertyName, value) => {
        switch (propertyName) {
            case "name":
                setName({ value: value, errors: [] });
                if (value.length === 0) {
                    setName({ value: value, errors: ["Enter the project name"] });
                }
                break;
            case "description":
                setDescription({ value: value, errors: [] });
                if (value.length === 0) {
                    setDescription({ value: value, errors: ["Enter the project Domain and Main Problem"] });
                }
                break;
            case "techDescription":
                setTechDescription({ value: value, errors: [] });
                if (value.length === 0) {
                    setTechDescription({ value: value, errors: ["Enter the project Technologies Description"] });
                }
                break;
        }
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id.value ?? null);
            form.append("name", name.value ?? null);
            form.append("priority", priority.value ?? null);
            form.append("description", description.value ?? null);
            form.append("url", url.value ?? null);
            form.append("techDescription", techDescription.value ?? null);
            form.append("logoAlt", logoAlt.value ?? null);

            form.append("technologies", JSON.stringify(technologies) ?? []);
            form.append("logoUrl", logoUrl ?? null);
            form.append('logo', selectedFile ?? null);
            form.append("logoChanged", selectedFile ? true : false);

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
                    <div className={formStyles.formGroup}>
                        <label className={name.errors.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Name *</label>
                        <input type="text" className={formStyles.formControl} value={name.value} onChange={(e) => onChangeController("name", e.target.value)} />
                        {
                            name.errors.map((error, index) => <small key={"name-error" + index} className={formStyles.formControlError}>{error}</small>)
                        }
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={description.errors.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>Domain and Main Problem *</label>
                        <textarea className={formStyles.formControl} value={description.value} onChange={(e) => onChangeController("description", e.target.value)} ></textarea>
                        {
                            description.errors.map((error, index) => <small key={"description-error" + index} className={formStyles.formControlError}>{error}</small>)
                        }
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Priority</label>
                        <input type="number" className={formStyles.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, errors: [] })} />
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>URL</label>
                        <input type="text" className={formStyles.formControl} value={url.value} onChange={(e) => setUrl({ value: e.target.value, errors: [] })} />
                    </div>
                    <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                        {
                            preview ?
                                <Image width={100} height={100} className={formStyles.imagePreview} src={preview} alt="Preview" />
                                :
                                <i className={formStyles.imagePreview}></i>
                        }
                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Logo Alt</label>
                        <input type="text" className={formStyles.formControl} value={logoAlt.value} onChange={(e) => setCoverAlt({ value: e.target.value, errors: [] })} />
                    </div>
                    <h5 className={formStyles.formSectionTitle}>Technologies</h5>
                    <div className={formStyles.formGroup}>
                        <label className={techDescription.errors.length > 0 ? formStyles.formLabelError : formStyles.formLabel}>About Technologies *</label>
                        <textarea className={formStyles.formControl} value={techDescription.value} onChange={(e) => onChangeController("techDescription", e.target.value)} ></textarea>
                        {
                            techDescription.errors.map((error, index) => <small key={"techDescription-error" + index} className={formStyles.formControlError}>{error}</small>)
                        }
                    </div>
                    <ul className={componentStyles.projectTechList}>
                        {technologies.map((tech, index) => <li key={index} onClick={() => { onRemovedTechnology(tech) }}>{tech.name}</li>)}
                    </ul>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Tech" : "Add Tech"}</button>
                    {innerForm ? <InnerForm onSubmit={onInnerFormSubmitted} /> : ''}
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProjectForm;