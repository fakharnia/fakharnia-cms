"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import formStyles from "../styles/form.module.css";
import componentStyles from "./page.module.css";
import { useMenu } from "@/app/context/menuContext";
import { useDashboardMessage } from "../context/messageContext";
import { getAction, updateAction } from "./action";
import { SkillForm } from "./components/skill";
import { ContactForm } from "./components/contact";

const Resume = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;
    const router = useRouter();

    // Contextes
    const { changeMenu } = useMenu();
    const { addMessage, cancel } = useDashboardMessage();

    // Form properties
    const [_id, setId] = useState("");
    const [fa_aboutMe, setFa_aboutMe] = useState({ value: "", error: "" });
    const [en_aboutMe, setEn_aboutMe] = useState({ value: "", error: "" });
    const [deu_aboutMe, setDeu_aboutMe] = useState({ value: "", error: "" });
    const [fa_text, setFa_text] = useState({ value: "", error: "" });
    const [en_text, setEn_text] = useState({ value: "", error: "" });
    const [deu_text, setDeu_text] = useState({ value: "", error: "" });
    const [fileUrl, setFileUrl] = useState({ value: "", error: "" });
    const [selectedFile, setSelectedFile] = useState("");
    const [avatarUrl, setAvatarUrl] = useState({ value: "", error: "" });
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [preview, setPreview] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillsFiles, setSkillsFiles] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [deletedSkills, setDeletedSkills] = useState([]);
    const [fileChanged, setFileChanged] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false);

    const [skillForm, setSkillForm] = useState(false);
    const [contactForm, setContactForm] = useState(false);

    const fetchResume = async () => {
        const response = await getAction()
        setId(response?._id ?? "");
        setFa_aboutMe({ value: response?.fa_aboutMe ?? "", error: "" });
        setEn_aboutMe({ value: response?.en_aboutMe ?? "", error: "" });
        setDeu_aboutMe({ value: response?.deu_aboutMe ?? "", error: "" });
        setFa_text({ value: response?.fa_text ?? "", error: "" });
        setEn_text({ value: response?.en_text ?? "", error: "" });
        setDeu_text({ value: response?.deu_text ?? "", error: "" });
        setFileUrl({ value: response?.fileUrl ?? "", error: "" });
        setAvatarUrl({ value: response?.avatarUrl ?? "", error: "" });
        setSelectedFile(null);
        setSelectedAvatar(null);
        setSkills(response?.skills ?? []);
        setContacts(response?.contacts ?? []);
        setDeletedSkills([]);
        setPreview(response?.avatarUrl ? `${previewURL}/resume/${response?.avatarUrl}` : null);
    };

    useEffect(() => {
        fetchResume();
        changeMenu("/dashboard/resume");
    }, []);

    const onSkillFormSubmitted = (data) => {
        if (data) {
            setSkills([...skills, {
                title: data.title,
                priority: data.priority,
                rate: data.rate,
                fileUrl: data.fileUrl,
                fileAlt: data.fileAlt,
                preview: data.preview
            }]);
            setSkillsFiles([...skillsFiles, data.file]);
            setSkillForm(false);
        }
    }

    const onDeleteSkill = (skill, skillFile) => {
        const skls = skills.filter(skl => JSON.stringify(skl) !== JSON.stringify(skill));
        setSkills(skls)
        const sklFile = skillsFiles.filter(skl => JSON.stringify(skl) !== JSON.stringify(skillFile));
        setSkillsFiles(sklFile);
        if (skill._id) {
            setDeletedSkills([...deletedSkills, skill.fileUrl]);
        }
    }

    const onContactFormSubmitted = (data) => {
        if (data) {
            setContacts([...contacts, {
                link: data.link,
                priority: data.priority,
                iconClass: data.iconClass
            }]);
            setContactForm(false);
        }
    }

    const onDeleteContact = (contact, contactFile) => {
        const cnts = contacts.filter(cnt => JSON.stringify(cnt) !== JSON.stringify(contact));
        setContacts(cnts)
    }

    const onFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            if (_id) {
                setFileChanged(true);
            }
        }
    };

    const onAvatarFileChanged = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            setAvatarUrl({ value: file.name, error: "" });
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            if (_id) {
                setAvatarChanged(true);
            }
        }
    };

    const onChangeController = (propertyName, value) => {
        switch (propertyName) {
            case "fa_aboutMe":
                setFa_aboutMe({ value: value, error: null });
                if (value.length === 0) {
                    setFa_aboutMe({ value: value, error: "Enter the About Me (Farsi)" });
                }
                break;
            case "en_aboutMe":
                setEn_aboutMe({ value: value, error: null });
                if (value.length === 0) {
                    setEn_aboutMe({ value: value, error: "Enter the About Me (English)" });
                }
                break;
            case "deu_aboutMe":
                setEn_aboutMe({ value: value, error: null });
                break;
            case "fa_text":
                setFa_text({ value: value, error: null });
                if (value.length === 0) {
                    setFa_text({ value: value, error: "Enter the Text (Farsi)" });
                }
                break;
            case "en_text":
                setEn_text({ value: value, error: null });
                if (value.length === 0) {
                    setEn_text({ value: value, error: "Enter the Text (English)" });
                }
                break;
            case "deu_text":
                setEn_text({ value: value, error: null });
                break;
        }
    }

    const formValidation = () => {
        var result = true;

        if (!fileUrl.value || fileUrl.value.length === 0) {
            result = false;
            setFileUrl({ ...fileUrl, error: "Resume File is required!" });
        }

        if (!fa_aboutMe.value || fa_aboutMe.value.length === 0) {
            result = false;
            setFa_aboutMe({ ...fa_aboutMe, error: "About Me is required!" });
        }
        if (!en_aboutMe.value || en_aboutMe.value.length === 0) {
            result = false;
            setEn_aboutMe({ ...en_aboutMe, error: "About Me is required!" });
        }

        if (!fa_text.value || fa_text.value.length === 0) {
            result = false;
            setFa_text({ ...fa_text, error: "Text is required!" });
        }
        if (!en_text.value || en_text.value.length === 0) {
            result = false;
            setEn_text({ ...en_text, error: "Text is required!" });
        }

        if (!avatarUrl.value || avatarUrl.value.length === 0) {
            result = false;
            setFileUrl({ ...avatarUrl, error: "Avatar is required!" });
        }

        return result;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        if (formValidation()) {
            const form = new FormData();
            form.append("_id", _id ?? null);
            form.append("fa_aboutMe", fa_aboutMe.value ?? null);
            form.append("en_aboutMe", en_aboutMe.value ?? null);
            form.append("deu_aboutMe", deu_aboutMe.value ?? null);
            form.append("fa_text", fa_text.value ?? null);
            form.append("en_text", en_text.value ?? null);
            form.append("deu_text", deu_text.value ?? null);
            form.append("fileUrl", fileUrl.value);
            form.append("avatarUrl", avatarUrl.value);
            form.append("fileChanged", fileChanged);
            form.append("avatarChanged", avatarChanged);
            form.append("deletedSkills", deletedSkills.length > 0 ? JSON.stringify(deletedSkills) : "");

            const skls = skills.map(skl => ({
                _id: skl?._id,
                title: skl.title,
                priority: skl.priority,
                rate: skl.rate,
                fileUrl: skl.fileUrl,
                fileAlt: skl.fileAlt
            }))
            const cnts = contacts.map(cnt => ({
                _id: cnt?._id,
                link: cnt.link,
                priority: cnt.priority,
                iconClass: cnt.iconClass
            }))

            form.append("contacts", JSON.stringify(cnts))
            form.append("skills", JSON.stringify(skls))
            form.append("file", selectedFile);
            form.append("avatar", selectedAvatar);

            skillsFiles.forEach((skl, index) => {
                form.append(`skillsFiles`, skl);
            });

            try {
                const result = await updateAction(form);

                if (result !== undefined) {
                    addMessage({ text: "Resume Successfully Updated", cancel: cancel, type: "message" });
                    changeMenu("/dashboard");
                    router.push("/dashboard");

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
            <title>Fakharnia CMS | Resume</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Resume</h5>
                    <Link href="/dashboard" className={commonStyles.pageReturnButton} onClick={() => { changeMenu("/dashbaord") }}>Return</Link>
                </div>
                <form className={formStyles.form} onSubmit={submitForm}>
                    <h5 className={formStyles.formSectionTitle}>Contacts</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { contactForm ? setContactForm(false) : setContactForm(true) }} >{contactForm ? "Cancel Contact" : "Add Contact"}</button>
                    {contactForm ? <ContactForm onSubmit={onContactFormSubmitted} /> : null}
                    {contacts.length > 0 ?
                        <ul className={componentStyles.skillsList}>
                            {contacts.map((contact, index) => (
                                <li key={index} onDoubleClick={(e) => onDeleteContact(contact, contact.file)}>
                                    <div>
                                        <p>{contact.link}</p>
                                        <p>{contact.priority ?? "(not set)"} / {contact.iconClass ?? "(not set)"}</p>
                                    </div>

                                </li>))
                            }
                        </ul>
                        : null
                    }

                    <div className={`${formStyles.formGroup} ${formStyles.formGroupHasButton}`}>
                        <label className={formStyles.formLabel}>Avatar *</label>
                        {
                            preview ?
                                <Image width={100} height={100} className={formStyles.imagePreview} src={preview} alt="Preview" />
                                :
                                <i className={formStyles.imagePreview}></i>
                        }
                        <label className={formStyles.formUpload}>
                            <input className={formStyles.formControl} type="file" accept="image/*" onChange={onAvatarFileChanged} />
                            <i className={formStyles.innerButton}>Upload</i>
                        </label>
                        {avatarUrl.error ? <small className={formStyles.formControlError}>Avatar is required!</small> : null}
                    </div>
                    {/* About Me */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>About Me (Farsi) *</label>
                        <textarea className={formStyles.formControl} value={fa_aboutMe.value} onChange={(e) => onChangeController("fa_aboutMe", e.target.value)} ></textarea>
                        {fa_aboutMe.error ? <small className={formStyles.formControlError}>{fa_aboutMe.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>About Me (English) *</label>
                        <textarea className={formStyles.formControl} value={en_aboutMe.value} onChange={(e) => onChangeController("en_aboutMe", e.target.value)} ></textarea>
                        {en_aboutMe.error ? <small className={formStyles.formControlError}>{en_aboutMe.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>About Me (Deutsch)</label>
                        <textarea className={formStyles.formControl} value={deu_aboutMe.value} onChange={(e) => onChangeController("deu_aboutMe", e.target.value)} ></textarea>
                        {deu_aboutMe.error ? <small className={formStyles.formControlError}>{deu_aboutMe.error}</small> : null}
                    </div>

                    {/* Text */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Farsi Text *</label>
                        <textarea className={formStyles.formControl} value={fa_text.value} onChange={(e) => onChangeController("fa_text", e.target.value)} ></textarea>
                        {fa_text.error ? <small className={formStyles.formControlError}>{fa_text.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>English Text *</label>
                        <textarea className={formStyles.formControl} value={en_text.value} onChange={(e) => onChangeController("en_text", e.target.value)} ></textarea>
                        {en_text.error ? <small className={formStyles.formControlError}>{en_text.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Deutsch Text</label>
                        <textarea className={formStyles.formControl} value={deu_text.value} onChange={(e) => onChangeController("deu_text", e.target.value)} ></textarea>
                        {deu_text.error ? <small className={formStyles.formControlError}>{deu_text.error}</small> : null}
                    </div>


                    <h5 className={formStyles.formSectionTitle}>Skills</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { skillForm ? setSkillForm(false) : setSkillForm(true) }} >{skillForm ? "Cancel Skill" : "Add Skill"}</button>
                    {skillForm ? <SkillForm onSubmit={onSkillFormSubmitted} /> : null}
                    {skills.length > 0 ?
                        <ul className={componentStyles.skillsList}>
                            {skills.map((skill, index) => (
                                <li key={index} onDoubleClick={(e) => onDeleteSkill(skill, skill.file)}>
                                    <Image width={100} height={100} className={formStyles.imagePreview} src={skill.preview ? skill.preview : `${previewURL}/resume/${skill.fileUrl}`} alt="Preview" />
                                    <div>
                                        <p>{skill.title}</p>
                                        <p>{skill.en_description}</p>
                                        <small>priority-{skill.priority} | Rate-{skill.rate}</small>
                                    </div>

                                </li>))
                            }
                        </ul>
                        : null
                    }
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>Resume File *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept="application/pdf" onChange={onFileChanged} />
                            <i className={formStyles.uploadText}>{fileUrl.value ? fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {fileUrl.error ? <small className={formStyles.formControlError}>File is required!</small> : null}
                    </div>
                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Resume;