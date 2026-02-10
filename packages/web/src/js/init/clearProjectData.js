import { projectData } from '../../../../core/src/config.js';

export const clearProjectData = () => {
    projectData.handle = '';
    projectData.md = [];
    projectData.css = [];
    projectData.images = {};
}

