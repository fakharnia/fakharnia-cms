"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import projectStyles from "./page.module.css";
import { useMessage } from "@/app/context/messageContext";
import { getProjects } from "@/lib/project.lib";
import { deleteProject } from "@/lib/project.lib";

export const Projects = () => {

    const [projects, setProjects] = useState([]);
    const previewURL = process.env.NEXT_PUBLIC_API;
    const { addMessage, cancel } = useMessage();


    const handleDelete = async (projectId) => {
        const result = await deleteProject(projectId);
        if (result !== undefined) {
            addMessage({ text: "Project Successfully Deleted", okText: "OK", ok: cancel });
            await fetchProjects();
        } else {
            addMessage({ text: "Operation Failed!", okText: "OK", ok: cancel });
        }
    }

    const fetchProjects = async () => {
        const response = await getProjects() || [];
        setProjects(response ?? []);
    };

    useEffect(() => {
        fetchProjects();
    }, [])

    return (
        <>
            <title>Fakharnia CMS | Projects</title>
            <div className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                    <h5 className={styles.pageTitle}>Projects</h5>
                    <Link className={styles.pageAddButton} href="./projects/0">Add</Link>
                </div>
                <ul className={projectStyles.projectsList}>
                    {
                        projects.map((project, index) =>
                        (
                            <li key={project._id} className={projectStyles.project}>
                                <Image className={projectStyles.projectLogo} src={`${previewURL}/public/project/${project.logoUrl}`} width={500} height={190} alt={project.logoAlt} />
                                <div className={projectStyles.projectBox}>
                                    <h5 className={projectStyles.projectName}>{project.name}</h5>
                                    <div className={projectStyles.projectOptions}>
                                        <Link className={projectStyles.projectButton} href={"/dashboard/projects/" + project._id}>Edit</Link>
                                        <button className={projectStyles.projectButton} onClick={() => { handleDelete(project._id) }}>Delete</button>
                                    </div>

                                </div>
                            </li>
                        ))
                    }
                </ul>
                {projects.length === 0 ? <p className={projectStyles.noData}>There isn't any project yet!</p> : ""}
            </div>
        </>
    )

}

export default Projects;