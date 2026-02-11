import figlet from 'figlet';

// Reset filget color \x1b[0m
const reset = '\x1b[0m';
const teal = "\x1b[38;2;69;133;136m";
const grey = '\x1b[38;2;171;178;191m'

const style = {
    teal: (text) => `${teal}${text}${reset}`,
    grey: (text) => `${grey}${text}${reset}`,
    link: (text, url) => `\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`
};

export const displayWelcomeBanner = () => {
    // 1. Generate the ASCII art with the specific font
    console.clear();
    console.log('\n\n')
    const text = figlet.textSync("Pixel & Paper", {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    });

    // 3. Print the colored text
    console.log(teal + text + reset);
}



export const displayWelcomeMessage = (PORT) =>{

    console.log(`
        ${style.grey('✔ Server Started Successfully!')}
  
        ${style.grey('Local System:')}    ${style.link(`http://localhost:${PORT}`, `http://localhost:${PORT}`)}
  
        ${style.grey('Press Ctrl+C to stop')}
    `);

}