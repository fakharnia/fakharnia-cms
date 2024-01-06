"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import commonStyles from "../page.module.css";
import componentStyles from "./page.module.css";
import { useDashboardMessage } from "../context/messageContext";
import { useMenu } from "@/app/context/menuContext";
import { getsAction, deleteAction } from "./action";

export const Projects = () => {
    const previewURL = process.env.NEXT_PUBLIC_API_STATIC_ENDPOINT;

    const { addMessage, cancel } = useDashboardMessage();
    const { changeMenu } = useMenu();
    const [projects, setProjects] = useState([]);

    const onDeleteProject = async (projectId) => {
        const result = await deleteAction(projectId);
        if (result !== undefined) {
            addMessage({ text: "Project Successfully Deleted", cancel: cancel, type: "message" });
            await fetchProjects();
        } else {
            addMessage({ text: "Operation Failed!", cancel: cancel, type: "error" });
        }
    }

    const fetchProjects = async () => {
        try {
            const response = await getsAction() || [];
            setProjects(response ?? []);
        } catch (error) {
            addMessage({ text: "Connection to server failed!", cancel: cancel, type: "error" });
        }
    };

    useEffect(() => {
        fetchProjects();
        changeMenu("/dashboard/projects");
    }, [])

    return (
        <>
            <title>Fakharnia CMS | Projects</title>
            <div className={commonStyles.pageContainer}>
                <div className={commonStyles.pageHeader}>
                    <h5 className={commonStyles.pageTitle}>Projects</h5>
                    <Link className={commonStyles.pageAddButton} href="./projects/0">Add</Link>
                </div>
                <ul className={componentStyles.projectsList}>
                    {
                        projects.map((project, index) =>
                        (
                            <li key={project._id} className={componentStyles.project}>
                                <Image className={componentStyles.projectLogo} src={`${previewURL}/project/${project.logoUrl}`} width={500} height={190} alt={project.logoAlt} />
                                <div className={componentStyles.projectBox}>
                                    <h5 className={componentStyles.projectName}>{project.en_name}</h5>
                                    <div className={componentStyles.projectOptions}>
                                        <Link className={componentStyles.projectButton} href={"/dashboard/projects/" + project._id}>Edit</Link>
                                        <button className={componentStyles.projectButton} onClick={() => { onDeleteProject(project._id) }}>Delete</button>
                                    </div>

                                </div>
                            </li>
                        ))
                    }
                </ul>
                {projects.length === 0 ? <p className={componentStyles.noData}>There isn't any project yet!</p> : ""}
            </div>
        </>
    )

}

export default Projects;