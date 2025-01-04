const disabled_configurations = ["1+0", "2+1", "3+0"];
const elements_selector = '.lobby__app__content.lpools [role="button"]';

function start() {
    inject_styles();
    disable_buttons();
}

function disable_buttons() {
    const elements = document.querySelectorAll(elements_selector);

    let disabled_elements = 0;

    elements.forEach((element) => {
        if (disabled_configurations.includes(element.attributes['data-id'].value)) {

            const newElement = removeAllEventListeners(element);
            newElement.classList.add('disabled');
            newElement.classList.add('transp');
            newElement.disabled = true;
            newElement.style.cursor = 'not-allowed';
            newElement.attributes['data-id'].value = 'disabled';
            newElement.title = 'Disabled by Disable Bullet Extension';

            disabled_elements++;
        }
    });

    // To avoid infinite loop
    if (disabled_elements > 0) {
        console.log("Lichess Disable Bullet, manage to disable " + disabled_elements + " buttons");
        observer.disconnect();
    }
}

// Triggers
document.addEventListener("DOMContentLoaded", start);
const observer = new MutationObserver(() => {
    disable_buttons();
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});


/**
 * Clean all listeners by cloning the element
 */
function removeAllEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
}

function inject_styles() {
    const style = document.createElement('style');
    style.textContent = `
    /* Stylesheet injected by Disable Bullet extension */
    ${elements_selector}.disabled:hover {
        opacity: .35 !important;     
        transition: none !important;
        cursor: not-allowed !important;
    }
    `;
    document.head.appendChild(style);
}