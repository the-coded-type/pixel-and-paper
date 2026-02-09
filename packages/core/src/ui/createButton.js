/**
 * Generates a button and appends it to the container.
 * @param {HTMLElement|string} container - The DOM element OR the ID string of the container (defaults to body).
 * @param {string} className - Class names to apply.
 * @param {string} id - The ID for the new button.
 * @param {string} text - The label text.
 */

export const createButton = (container = document.body , className = '', id = '', text = 'Button') => {
    const containerElt = typeof container === "string" ? document.getElementById(container) : container;
    if (!containerElt) {
        console.error(`createButton: Container not found.`);
        return;
    }
    const btn = document.createElement("button");
    if (className) btn.className = className;
    if (id) btn.id = id;
    if (text) btn.innerText = text;
    containerElt?.append(btn);

    // We return the created element, which might be useful to assing an event handler
    return btn;
}