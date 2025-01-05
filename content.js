const default_disabled_configurations = ["1+0", "2+1", "3+0", "5+0"];
const elements_selector_lichess = '.lobby__app__content.lpools [role="button"]';
const elements_selector_chesscom = '.time-selector-button-button';

let user_disabled_times = default_disabled_configurations;

// Función para obtener las preferencias del usuario
async function fetchUserDisabledTimes() {
    const { disabledTimes } = await chrome.storage.sync.get(["disabledTimes"]);
    user_disabled_times = disabledTimes || default_disabled_configurations;
}

function start() {
    inject_styles();
    disable_buttons_lichess();
}

// lichess
function enable_buttons_lichess() {

    const elements = document.querySelectorAll(elements_selector_lichess);

    let enabled_elements = 0;

    elements.forEach((element) => {
        if (element.classList.contains('disabled')) {
            element.classList.remove('disabled');
            element.classList.remove('transp');
            element.disabled = false;            
            element.style.cursor = '';

            if(element.attributes['data-id'].value == 'disabled') {
                element.attributes['data-id'].value = element.attributes['data-orig-id'].value;
            }
            element.title = '';

            enabled_elements++;
        }
    });

    if (enabled_elements > 0) {
        console.log("Lichess Disable Bullet, manage to enable " + enabled_elements + " buttons");
    }
}

function disable_buttons_lichess() {
    if(user_disabled_times.length == 0) {
        return;
    }

    let disabled_elements = 0;

    const elements = document.querySelectorAll(elements_selector_lichess);
    elements.forEach((element) => {
        if (user_disabled_times.includes(element.attributes['data-id'].value)) {
            element.classList.add('disabled');
            element.classList.add('transp');
            element.disabled = true;
            element.style.cursor = 'not-allowed';

            if(element.attributes['data-id'].value != 'disabled') {
                const attr = document.createAttribute('data-orig-id');
                attr.value = element.attributes['data-id'].value;
                element.setAttributeNode(attr);
            }
            
            element.attributes['data-id'].value = 'disabled';
            element.title = 'Disabled by Disable Bullet Extension';

            disabled_elements++;
        }
    });

    if (disabled_elements > 0) {
        console.log("Lichess Disable Bullet, manage to disable " + disabled_elements + " buttons");

        // To avoid infinite loop (due to the MutationObserver is changing the DOM all the time and triggering the observer)
        if(observer) {
            observer.disconnect();
        }
    }
}


function disable_buttons_chesscom() {
    if(user_disabled_times.length == 0) {
        return;
    }

    let disabled_elements = 0;

    const elements = document.querySelectorAll(elements_selector_chesscom);
    elements.forEach((element) => {
        const time_value = element.innerHTML.replace("min", '').trim().replaceAll(' ', '');
        const translated_value  = translateTimeValue(time_value);

        if (user_disabled_times.includes(time_value)) {
            
            element.disabled = true;
            element.style.cursor = 'not-allowed';

            if(element.attributes['data-id'].value != 'disabled') {
                const attr = document.createAttribute('data-orig-id');
                attr.value = element.attributes['data-id'].value;
                element.setAttributeNode(attr);
            }
            
            element.attributes['data-id'].value = 'disabled';
            element.title = 'Disabled by Disable Bullet Extension';

            disabled_elements++;
        }
    });

    if (disabled_elements > 0) {
        console.log("Lichess Disable Bullet, manage to disable " + disabled_elements + " buttons");

        // To avoid infinite loop (due to the MutationObserver is changing the DOM all the time and triggering the observer)
        if(observer) {
            observer.disconnect();
        }
    }
}

// Triggers
document.addEventListener("DOMContentLoaded", start);
const observer = new MutationObserver(async () => {
    await fetchUserDisabledTimes();
    disable_buttons_lichess();
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// Listen for changes in the storage in the website
chrome.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === 'sync' && changes.disabledTimes) {
        user_disabled_times = changes.disabledTimes.newValue || default_disabled_configurations;
        enable_buttons_lichess();
        disable_buttons_lichess();
    }
});

function inject_styles() {
    const style = document.createElement('style');
    style.textContent = `
    /* Stylesheet injected by Disable chess fast times extension */
    ${elements_selector_lichess}.disabled:hover {
        opacity: .35 !important;     
        transition: none !important;
        cursor: not-allowed !important;
    }
    `;
    document.head.appendChild(style);
}

function translateTimeValue(v) {
    switch (v) {
        case '1':
            return '1+0';
        case '1|1':
            return '1+1';
        case '3+0':
            return '3';
        case '5+0':
            return '5';
        default:
            return v;
    }
}