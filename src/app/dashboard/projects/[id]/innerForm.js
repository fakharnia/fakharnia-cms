"use client"

import { useState } from "react"

import styles from "../../styles/form.module.css";

export const InnerForm = ({ dataHandler }) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [description, setDescription] = useState({ value: "", error: "" });

    const formValidation = () => {
        let result = true;
        if (name.value.length === 0) {
            result = false;
            setName({ ...name, error: "Name required!" })
        }

        return result;
    }

    const submitTechnologyHandler = () => {
        if (formValidation()) {
            dataHandler({ name: name.value, description: description.value });
            setName({ value: "", error: "" });
            setDescription({ value: "", error: "" });
        }
    }

    return (
        <>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input type="text" className={styles.formControl} value={name.value} onChange={(e) => setName({ value: e.target.value, error: "" })} />
                {name.error.length > 0 ? <small className={styles.formControlError}>{name.error}</small> : ''}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description (MD)</label>
                <input type="text" className={styles.formControl} value={description.value} onChange={(e) => setDescription({ value: e.target.value, error: "" })} />
            </div>
            <div className={styles.formButtons}>
                <button type="button" className={styles.submitInnerButton} onClick={submitTechnologyHandler}>Add</button>
            </div>
        </>
    )
}
