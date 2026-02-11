import { projectData } from '@core/config.js';

export const clearProjectData = () => {
    projectData.handle = '';
    projectData.md = [];
    projectData.css = [];
    projectData.images = {};
}

