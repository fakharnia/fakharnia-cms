"use client"

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import styles from "../../page.module.css";
import stylesPage from "../page.module.css";
import stylesProject from "../../styles/form.module.css";
import { getProject } from "@/lib/project.lib";
import { useMessage } from "@/app/context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { InnerForm } from "./innerForm";


import { create, update } from "./action";

export const ProjectForm = ({ params }) => {

    const previewURL = process.env.NEXT_PUBLIC_API;
    const router = useRouter();
    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useMessage();

    const [innerForm, setInnerForm] = useState(false);

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

    const [mode, setMode] = useState("create");


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
        setDeletedTechnologies([]);
        setLogoUrl(response?.logoUrl ?? null);
        setPreview(response?.logoUrl ? `${previewURL}/public/project/${response?.logoUrl}` : null);
        setSelectedFile(null);
    }

    useEffect(() => {
        if (params.id !== "0") {
            fetchProject();
        }
    }, []);



    const handleTechnologyData = (tech) => {
        setTechnologies([...technologies, tech]);
        setInnerForm(false);
    }

    const handleFileChange = (event) => {
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


    const onRemoveTechnology = (tech) => {
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

    const setFormController = (propertyName, value) => {
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

    const submitHandler = async (event) => {
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

            let requestResult;
            if (mode === "edit") {
                requestResult = await update(form);

            } else {
                requestResult = await create(form);
            }

            if (requestResult !== undefined) {
                addMessage({ text: "Service Successfully Created", okText: "OK", ok: cancel });
                changeMenu("/dashboard/projects");
                router.push("/dashboard/projects");
            } else {
                addMessage({ text: "Operation Failed!", okText: "OK", ok: cancel });
            }
        }
    }


    return (
        <>
            <title>Fakharnai CM | Projects/{mode === 'edit' ? 'Edit' : 'Define'}</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>{mode === 'edit' ? 'Edit' : 'Define'} Project</h5>
                    <Link className={styles.pageAddButton} href="/dashboard/projects">Back</Link>
                </div>
                <form className={stylesProject.form} onSubmit={submitHandler}>
                    <div className={stylesProject.formGroup}>
                        <label className={name.errors.length > 0 ? stylesProject.formLabelError : stylesProject.formLabel}>Name *</label>
                        <input type="text" className={stylesProject.formControl} value={name.value} onChange={(e) => setFormController("name", e.target.value)} />
                        {
                            name.errors.map((error, index) => <small key={"name-error" + index} className={stylesProject.formControlError}>{error}</small>)
                        }
                    </div>
                    <div className={stylesProject.formGroup}>
                        <label className={description.errors.length > 0 ? stylesProject.formLabelError : stylesProject.formLabel}>Domain and Main Problem *</label>
                        <textarea className={stylesProject.formControl} value={description.value} onChange={(e) => setFormController("description", e.target.value)} ></textarea>
                        {
                            description.errors.map((error, index) => <small key={"description-error" + index} className={stylesProject.formControlError}>{error}</small>)
                        }
                    </div>
                    <div className={stylesProject.formGroup}>
                        <label className={stylesProject.formLabel}>Priority</label>
                        <input type="number" className={stylesProject.formControl} value={priority.value} onChange={(e) => setPriority({ value: e.target.value, errors: [] })} />
                    </div>
                    <div className={stylesProject.formGroup}>
                        <label className={stylesProject.formLabel}>URL</label>
                        <input type="text" className={stylesProject.formControl} value={url.value} onChange={(e) => setUrl({ value: e.target.value, errors: [] })} />
                    </div>
                    <div className={`${stylesProject.formGroup} ${stylesProject.formGroupHasButton}`}>
                        {
                            preview ?
                                <Image width={100} height={100} className={stylesProject.imagePreview} src={preview} alt="Preview" />
                                :
                                <i className={stylesProject.imagePreview}></i>
                        }
                        <label className={stylesProject.formUpload}>
                            <input className={stylesProject.formControl} type="file" accept="image/*" onChange={handleFileChange} />
                            <i className={stylesProject.innerButton}>Upload</i>
                        </label>
                    </div>
                    <div className={stylesProject.formGroup}>
                        <label className={stylesProject.formLabel}>Logo Alt</label>
                        <input type="text" className={stylesProject.formControl} value={logoAlt.value} onChange={(e) => setCoverAlt({ value: e.target.value, errors: [] })} />
                    </div>
                    <h5 className={stylesProject.formSectionTitle}>Technologies</h5>
                    <div className={stylesProject.formGroup}>
                        <label className={techDescription.errors.length > 0 ? stylesProject.formLabelError : stylesProject.formLabel}>About Technologies *</label>
                        <textarea className={stylesProject.formControl} value={techDescription.value} onChange={(e) => setFormController("techDescription", e.target.value)} ></textarea>
                        {
                            techDescription.errors.map((error, index) => <small key={"techDescription-error" + index} className={stylesProject.formControlError}>{error}</small>)
                        }
                    </div>
                    <ul className={stylesPage.projectTechList}>
                        {technologies.map((tech, index) => <li key={index} onClick={() => { onRemoveTechnology(tech) }}>{tech.name}</li>)}
                    </ul>
                    <button type="button" className={styles.pageAddButton} onClick={() => { innerForm ? setInnerForm(false) : setInnerForm(true) }} >{innerForm ? "Cancel Tech" : "Add Tech"}</button>
                    {innerForm ? <InnerForm dataHandler={handleTechnologyData} /> : ''}
                    <div className={stylesProject.formButtons}>
                        <button type="submit" className={stylesProject.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProjectForm;