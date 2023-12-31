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
import { LanguageForm } from "./components/language";
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
    const [aboutMe, setAboutMe] = useState({ value: "", error: "" });
    const [text, setText] = useState({ value: "", error: "" });
    const [education, setEducation] = useState({ value: "", error: "" });
    const [hobbies, setHobbies] = useState("");
    const [fileUrl, setFileUrl] = useState({ value: "", error: "" });
    const [selectedFile, setSelectedFile] = useState("");
    const [avatarUrl, setAvatarUrl] = useState({ value: "", error: "" });
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [preview, setPreview] = useState("");
    const [languages, setLanguages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [skillsFiles, setSkillsFiles] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [contactsFiles, setContactsFiles] = useState([]);
    const [deletedSkills, setDeletedSkills] = useState([]);
    const [deletedContacts, setDeletedContacts] = useState([]);
    const [fileChanged, setFileChanged] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false);

    const [languageForm, setLanguageForm] = useState(false);
    const [skillForm, setSkillForm] = useState(false);
    const [contactForm, setContactForm] = useState(false);

    const fetchResume = async () => {
        const response = await getAction()
        setId(response?._id ?? "");
        setAboutMe({ value: response?.aboutMe ?? "", error: "" });
        setText({ value: response?.text ?? "", error: "" });
        setEducation({ value: response?.education ?? "", error: "" });
        setHobbies(response?.hobbies ?? "");
        setFileUrl({ value: response?.fileUrl ?? "", error: "" });
        setAvatarUrl({ value: response?.avatarUrl ?? "", error: "" });
        setSelectedFile(null);
        setSelectedAvatar(null);
        setLanguages(response?.languages ?? []);
        setSkills(response?.skills ?? []);
        setContacts(response?.contacts ?? []);
        setDeletedSkills([]);
        setDeletedContacts([]);
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
                description: data.description,
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
                fileUrl: data.fileUrl,
                fileAlt: data.fileAlt,
                preview: data.preview
            }]);
            setContactsFiles([...contactsFiles, data.file]);
            setContactForm(false);
        }
    }

    const onDeleteContact = (contact, contactFile) => {
        const cnts = contacts.filter(cnt => JSON.stringify(cnt) !== JSON.stringify(contact));
        setContacts(cnts)
        const cntFile = contactsFiles.filter(cnt => JSON.stringify(cnt) !== JSON.stringify(contactFile));
        setContactsFiles(cntFile);

        if (contact._id) {
            setDeletedContacts([...deletedContacts, contact.fileUrl]);
        }
    }

    const onLanguageFormSubmitted = (data) => {
        if (data) {
            setLanguages([...languages, data]);
            setLanguageForm(false);
        }
    }

    const onDeleteLanguage = (language) => {
        const lngs = languages.filter(lan => JSON.stringify(lan) !== JSON.stringify(language));
        setLanguages(lngs)
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
            case "aboutMe":
                setAboutMe({ value: value, error: null });
                if (value.length === 0) {
                    setAboutMe({ value: value, error: "Enter the About Me" });
                }
                break;
            case "text":
                setText({ value: value, error: null });
                if (value.length === 0) {
                    setText({ value: value, error: "Enter the Text" });
                }
                break;
            case "education":
                setEducation({ value: value, error: null });
                if (value.length === 0) {
                    setEducation({ value: value, error: "Enter the Education" });
                }
                break;
        }
    }

    const formValidation = () => {
        var result = true;

        if (!fileUrl.value || fileUrl.value.length === 0) {
            result = false;
            setFileUrl({ ...fileUrl, error: "Resume File is required!" });
        }

        if (!aboutMe.value || aboutMe.value.length === 0) {
            result = false;
            setFileUrl({ ...aboutMe, error: "About Me is required!" });
        }

        if (!text.value || text.value.length === 0) {
            result = false;
            setFileUrl({ ...text, error: "Text is required!" });
        }

        if (!education.value || education.value.length === 0) {
            result = false;
            setFileUrl({ ...education, error: "Education is required!" });
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
            form.append("aboutMe", aboutMe.value ?? null);
            form.append("text", text.value ?? null);
            form.append("education", education.value ?? null);
            form.append("hobbies", hobbies ?? null);
            form.append("fileUrl", fileUrl.value);
            form.append("avatarUrl", avatarUrl.value);
            form.append("fileChanged", fileChanged);
            form.append("avatarChanged", avatarChanged);
            form.append("deletedContacts", deletedContacts.length > 0 ? JSON.stringify(deletedContacts) : "");
            form.append("deletedSkills", deletedSkills.length > 0 ? JSON.stringify(deletedSkills) : "");

            const skls = skills.map(skl => ({
                _id: skl?._id,
                title: skl.title,
                description: skl.description,
                priority: skl.priority,
                rate: skl.rate,
                fileUrl: skl.fileUrl,
                fileAlt: skl.fileAlt
            }))
            const cnts = contacts.map(cnt => ({
                _id: cnt?._id,
                link: cnt.link,
                priority: cnt.priority,
                fileUrl: cnt.fileUrl,
                fileAlt: cnt.fileAlt
            }))

            form.append("contacts", JSON.stringify(cnts))
            form.append("skills", JSON.stringify(skls))
            form.append("languages", JSON.stringify(languages));
            form.append("file", selectedFile);
            form.append("avatar", selectedAvatar);

            contactsFiles.forEach((cnt, index) => {
                form.append(`contactsFiles`, cnt);
            });
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
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.uploadLabel}>Resume File *</label>
                        <label className={`${formStyles.formUpload} ${formStyles.uploadNamed}`}>
                            <input className={formStyles.formControl} type="file" accept="application/pdf" onChange={onFileChanged} />
                            <i className={formStyles.uploadText}>{fileUrl.value ? fileUrl.value : "No File Uploaded!"}</i>
                        </label>
                        {fileUrl.error ? <small className={formStyles.formControlError}>File is required!</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>About Me *</label>
                        <textarea className={formStyles.formControl} value={aboutMe.value} onChange={(e) => onChangeController("aboutMe", e.target.value)} ></textarea>
                        {aboutMe.error ? <small className={formStyles.formControlError}>About Me is required!</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Text *</label>
                        <textarea className={formStyles.formControl} value={text.value} onChange={(e) => onChangeController("text", e.target.value)} ></textarea>
                        {text.error ? <small className={formStyles.formControlError}>Text is required!</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Education *</label>
                        <input type="text" className={formStyles.formControl} value={education.value} onChange={(e) => onChangeController("education", e.target.value)} />
                        {education.error ? <small className={formStyles.formControlError}>{education.error}</small> : null}
                    </div>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.formLabel}>Hobbies</label>
                        <textarea className={formStyles.formControl} value={hobbies} onChange={(e) => setHobbies(e.target.value)} ></textarea>
                    </div>
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
                                        <p>{skill.description}</p>
                                        <small>priority-{skill.priority} | Rate-{skill.rate}</small>
                                    </div>

                                </li>))
                            }
                        </ul>
                        : null
                    }
                    <h5 className={formStyles.formSectionTitle}>Contacts</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { contactForm ? setContactForm(false) : setContactForm(true) }} >{contactForm ? "Cancel Contact" : "Add Contact"}</button>
                    {contactForm ? <ContactForm onSubmit={onContactFormSubmitted} /> : null}
                    {contacts.length > 0 ?
                        <ul className={componentStyles.skillsList}>
                            {contacts.map((contact, index) => (
                                <li key={index} onDoubleClick={(e) => onDeleteContact(contact, contact.file)}>
                                    <Image width={100} height={100} className={formStyles.imagePreview} src={contact.preview ? contact.preview : `${previewURL}/resume/${contact.fileUrl}`} alt="Preview" />
                                    <div>
                                        <p>{contact.link}</p>
                                        <p>{contact.priority}</p>
                                    </div>

                                </li>))
                            }
                        </ul>
                        : null
                    }
                    <h5 className={formStyles.formSectionTitle}>Languages</h5>
                    <button type="button" className={commonStyles.pageAddButton} onClick={() => { languageForm ? setLanguageForm(false) : setLanguageForm(true) }} >{languageForm ? "Cancel Language" : "Add Language"}</button>
                    {languageForm ? <LanguageForm onSubmit={onLanguageFormSubmitted} /> : null}
                    {languages.length > 0 ?
                        <ul className={componentStyles.languagesList}>
                            {languages.map((lang, index) => (
                                <li key={index} onDoubleClick={(e) => onDeleteLanguage(lang)}>
                                    <p>{lang.title}</p>
                                    <p>SPEAKING-{lang.speakingRate} | READING-{lang.readingRate} | WRITING-{lang.writingRate} | LISTENING-{lang.listeningRate}</p>
                                </li>))
                            }
                        </ul>
                        : null
                    }

                    <div className={formStyles.formButtons}>
                        <button type="submit" className={formStyles.submitButton}>Save Changes</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Resume;