import { createButton } from './createButton.js';
import { printHandler } from '../controllers/printHandler.js';

/**
 * Creates a "Generate PDF" button and attaches the print event listener.
 * * This function utilizes the generic `createButton` helper to build the DOM element
 * and immediately binds the `printHandler` to its click event.
 * @param {HTMLElement|string} container - The DOM element or ID of the container where the button should be appended.
 * @param {string} [className] - Optional CSS class names to apply to the button.
 * @param {string} [id] - Optional ID for the button element.
 * @param {string} [text='Generate PDF'] - The label text for the button. Defaults to 'Generate PDF'.
 * @returns {HTMLButtonElement|undefined} The created button element, or undefined if the container was not found.
 */

export const createGeneratePdfButton = (container, className, id, text = 'Generate PDF') => {
    const generatePdfButtonElement = createButton(container , className, id, text);

    if (generatePdfButtonElement) {
        generatePdfButtonElement.addEventListener("click", printHandler);
    }

    return generatePdfButtonElement;
}

