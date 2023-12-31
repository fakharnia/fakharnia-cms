import { useState } from "react";
import formStyles from "../../styles/form.module.css";
import commonStyles from "../../page.module.css";

export const LanguageForm = ({ onSubmit }) => {

    const [title, setTitle] = useState({ value: "", error: "" });
    const [speakingRate, setSpeakingRate] = useState({ value: "", error: "" });
    const [readingRate, setReadingRate] = useState({ value: "", error: "" });
    const [writingRate, setWritingRate] = useState({ value: "", error: "" });
    const [listeningRate, setListeningRate] = useState({ value: "", error: "" });

    const onChangeController = (propertyName, value) => {
        switch (propertyName) {
            case "title":
                setTitle({ value: value, error: null });
                if (value.length === 0) {
                    setTitle({ value: value, error: "Enter the Title" });
                }
                break;
            case "speakingRate":
                setSpeakingRate({ value: value, error: null });
                if (value.length === 0) {
                    setSpeakingRate({ value: value, error: "Enter the Speaking Rate" });
                }
                break;
            case "readingRate":
                setReadingRate({ value: value, error: null });
                if (value.length === 0) {
                    setReadingRate({ value: value, error: "Enter the Reading Rate" });
                }
                break;
            case "writingRate":
                setWritingRate({ value: value, error: null });
                if (value.length === 0) {
                    setWritingRate({ value: value, error: "Enter the Writing Rate" });
                }
                break;
            case "listeningRate":
                setListeningRate({ value: value, error: null });
                if (value.length === 0) {
                    setListeningRate({ value: value, error: "Enter the Listening Rate" });
                }
                break;

        }
    }

    const formValidation = () => {
        let result = true;

        if (title.value === null) {
            result = false;
            setTitle({ ...title, error: "Title is required!" });
        }
        if (speakingRate.value === "") {
            result = false;
            setSpeakingRate({ ...speakingRate, error: "Speaking Rate is required!" });
        }
        if (readingRate.value === "") {
            result = false;
            setReadingRate({ ...readingRate, error: "Reading Rate is required!" });
        }
        if (writingRate.value === "") {
            result = false;
            setWritingRate({ ...writingRate, error: "Writing Rate is required!" });
        }
        if (listeningRate.value === "") {
            result = false;
            setListeningRate({ ...listeningRate, error: "Listening Rate is required!" });
        }

        return result;
    }

    const submitForm = (event) => {
        event.preventDefault();

        if (formValidation()) {
            const data = {
                _id: null,
                title: title.value,
                speakingRate: speakingRate.value,
                readingRate: readingRate.value,
                writingRate: writingRate.value,
                listeningRate: listeningRate.value,
            }
            onSubmit(data);
        }
    }

    return (
        <>
            <div className={commonStyles.pageHeader}>
                <h5 className={commonStyles.pageTitle}>Add Language</h5>
            </div>
            <form className={formStyles.form} >
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Title *</label>
                    <input type="text" className={formStyles.formControl} value={title.value} onChange={(e) => onChangeController("title", e.target.value)} />
                    {title.error ? <small className={formStyles.formControlError}>{title.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Speaking Rate *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={speakingRate.value} onChange={(e) => onChangeController("speakingRate", e.target.value)} />
                    {speakingRate.error ? <small className={formStyles.formControlError}>{speakingRate.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Reading Rate *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={readingRate.value} onChange={(e) => onChangeController("readingRate", e.target.value)} />
                    {readingRate.error ? <small className={formStyles.formControlError}>{readingRate.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Writing Rate *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={writingRate.value} onChange={(e) => onChangeController("writingRate", e.target.value)} />
                    {writingRate.error ? <small className={formStyles.formControlError}>{writingRate.error}</small> : null}
                </div>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>Listening Rate *</label>
                    <input type="number" min={1} max={5} className={formStyles.formControl} value={listeningRate.value} onChange={(e) => onChangeController("listeningRate", e.target.value)} />
                    {listeningRate.error ? <small className={formStyles.formControlError}>{listeningRate.error}</small> : null}
                </div>
                <div className={formStyles.formButtons}>
                    <button type="button" className={formStyles.submitInnerButton} onClick={submitForm}>Add</button>
                </div>
            </form>
        </>
    )

}