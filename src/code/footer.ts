import { selectAll, selectElement } from "@degreesign/ui";
import { menu_buttons } from "./menu";

type PageTypes = `home` | `stakes` | `about`;

const
    // footer buttons
    footer_button = selectAll(`.footer_button`),
    footer_stakes_button = selectElement(`.footer_stakes_button`),
    footer_home_button = selectElement(`.footer_home_button`),
    footer_about_button = selectElement(`.footer_about_button`),

    // Get current page
    getCurrentPage = () => {
        try {
            const
                main = window?.location?.pathname?.split(`/`),
                search = window?.location?.search?.split(`?`),
                page = main[1] || search[1];
            return page as PageTypes
        } catch {

        };
    },

    // update footer
    updateFooter = (
        page: PageTypes
    ) => {

        for (let i = 0; i < footer_button.length; i++)
            footer_button[i]?.classList?.remove(`footer_button_selected`);

        page == `stakes` ? footer_stakes_button.classList.add(`footer_button_selected`)
            : page == `about` ? footer_about_button.classList.add(`footer_button_selected`)
                : footer_home_button.classList.add(`footer_button_selected`);

        if (page == `home` || page == `stakes`)
            menu_buttons.classList.remove(`hide`);
    };

// update footer
updateFooter(getCurrentPage() || `home`);

// home page
footer_home_button.onclick = () =>
    window.location.href = `/`;

// stakes page
footer_stakes_button.onclick = () =>
    window.location.href = `/?stakes`;

export {
    footer_home_button,
    footer_stakes_button,
    footer_about_button,
    getCurrentPage,
    updateFooter,
};