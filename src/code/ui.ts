import { repeatElements, selectAll, selectElement } from "@degreesign/ui";

interface GridData {
    text: string,
    label: string,
}

const
    itemGrid = ({
        parent,
        gridData,
    }: {
        parent: any,
        gridData?: GridData[]
    }) => {
        if (!gridData?.length) {
            parent.style.display = `none`;
            return
        };
        repeatElements({
            targetCount: gridData?.length,
            parent,
            children: selectAll(`.unit_grid_item`, parent),
        });
        const
            unit_grid_text = selectAll(`.unit_grid_text`, parent),
            unit_grid_label = selectAll(`.unit_grid_label`, parent);
        for (let i = 0; i < gridData.length; i++) {
            const { text, label } = gridData[i];
            unit_grid_text[i].textContent = text;
            unit_grid_label[i].textContent = label;
        };
        parent.style.display = `grid`;
    },
    itemText = ({
        element,
        text,
    }: {
        element: any,
        text?: string
    }) => {
        element.innerText = text;
        text ? element.classList.remove(`hide`)
            : element.classList.add(`hide`);
    },
    itemImg = ({
        element,
        src,
        alt,
    }: {
        element: any,
        src?: string,
        alt?: string,
    }) => {
        element.src = src || `./assets/images/placeholder_circle.svg`;
        element.alt = alt || `generic image`;
    },
    itemUnit = ({
        unit_frame,
        unitCover,
        gridDataTop,
        gridDataBottom,
        tokenLogoImg: tokenLogo,
        tokenLogoAlt,
        chainLogoImg: chainLogo,
        chainLogoAlt,
        mainText,
        subText,
        footerText,
        mainButtonText,
        mainButtonAction,
        squareButtonLogo = ``,
        squareButtonLogoAlt = ``,
        squareButtonDescription = ``,
        squareButtonAction,
        isShort,
    }: {
        unit_frame: any,
        unitCover?: string,
        gridDataTop?: GridData[],
        gridDataBottom?: GridData[],
        tokenLogoImg?: string,
        tokenLogoAlt?: string,
        chainLogoImg?: string,
        chainLogoAlt?: string,
        mainText?: string,
        subText?: string,
        footerText?: string,
        mainButtonText?: string,
        mainButtonAction?: Function,
        squareButtonLogo?: string,
        squareButtonLogoAlt?: string,
        squareButtonAction?: Function,
        squareButtonDescription?: string,
        isShort?: boolean,
    }) => {

        const
            unit_cover = selectElement(`.unit_cover`, unit_frame),
            unit_token_imgs = selectElement(`.unit_token_imgs`, unit_frame),
            unit_token_logo = selectElement(`.unit_token_logo`, unit_frame),
            unit_chain_logo = selectElement(`.unit_chain_logo`, unit_frame),
            unit_main_text = selectElement(`.unit_main_text`, unit_frame),
            unit_sub_text = selectElement(`.unit_sub_text`, unit_frame),
            unit_buttons = selectElement(`.unit_buttons`, unit_frame),
            unit_button_main = selectElement(`.unit_button_main`, unit_frame),
            unit_button_square = selectElement(`.unit_button_square`, unit_frame),
            unit_button_icon_small = selectElement(`.unit_button_icon_small`, unit_frame) as HTMLImageElement,
            unit_footer_text = selectElement(`.unit_footer_text`, unit_frame);

        // logos
        itemImg({
            element: unit_token_logo,
            src: tokenLogo,
            alt: tokenLogoAlt
        });
        itemImg({
            element: unit_chain_logo,
            src: chainLogo,
            alt: chainLogoAlt
        });
        unit_token_imgs.style.display = !tokenLogo && !chainLogo ? `none` : `flex`;

        // text
        itemText({ element: unit_cover, text: unitCover });
        itemText({ element: unit_main_text, text: mainText });
        itemText({ element: unit_sub_text, text: subText });
        itemText({ element: unit_footer_text, text: footerText });
        itemText({ element: unit_button_main, text: mainButtonText });

        // buttons
        unit_buttons.style.display = !mainButtonText && !squareButtonLogo ? `none` : `flex`;
        unit_button_main.onclick = () => mainButtonAction?.();
        squareButtonLogo ? unit_button_square.classList.remove(`hide`)
            : unit_button_square.classList.add(`hide`);
        unit_button_icon_small.src = squareButtonLogo;
        unit_button_icon_small.alt = squareButtonLogoAlt;
        unit_button_square.title = squareButtonDescription;
        unit_button_square.onclick = () => squareButtonAction?.();

        // top grid
        itemGrid({
            parent: selectElement(`.unit_grid_top`, unit_frame),
            gridData: gridDataTop,
        });

        // bottom grid
        itemGrid({
            parent: selectElement(`.unit_grid_bottom`, unit_frame),
            gridData: gridDataBottom,
        });

        isShort ? unit_frame.classList.add(`unit_frame_short`)
            : unit_frame.classList.remove(`unit_frame_short`);
    };

export {
    itemUnit,
}