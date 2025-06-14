import { BlockchainNetwork, ChainIds, getChainsData } from "merchantslate";
import { repeatElements, selectAll, selectElement } from "@degreesign/ui";
import textStrings from "../text.json"

const
    menu_buttons = selectElement(`.menu_buttons`),
    menu_dropdown_button = selectElement(`.menu_dropdown_button`, menu_buttons),
    menu_dropdown_icon = selectAll(`.menu_dropdown_icon`, menu_dropdown_button),
    menu_dropdown_text = selectElement(`.menu_dropdown_text`, menu_dropdown_button),
    menu_dropdown_list = selectElement(`.menu_dropdown_list`),
    listChains = (
        defaultChain: ChainIds,
        initiate: (chain: ChainIds) => void,
    ) => {

        const
            dropdownIcon0 = menu_dropdown_icon[0] as HTMLImageElement,
            dropdownIcon1 = menu_dropdown_icon[1] as HTMLImageElement;

        menu_dropdown_button.onclick = () => {
            if (menu_dropdown_list.classList.contains(`hide`)) {
                menu_dropdown_list.classList.remove(`hide`);
                dropdownIcon1.src = `../assets/images/arrow_drop_up.svg`;
            } else {
                menu_dropdown_list.classList.add(`hide`);
                dropdownIcon1.src = `../assets/images/arrow_drop_down.svg`;
            };
        };

        const
            chainsData = getChainsData(),
            chainsList: [string, BlockchainNetwork][] = Object.entries(chainsData)
        chainsList.sort((a, b) => a[1].deployed && !b[1].deployed ? -1 : 1);

        let menu_dropdown_button_wrapAll = selectAll(`.menu_dropdown_button_wrap`, menu_dropdown_list);
        repeatElements({
            targetCount: chainsList?.length,
            parent: menu_dropdown_list,
            children: menu_dropdown_button_wrapAll,
        });

        const
            menu_dropdown_buttonAll = selectAll(`.menu_dropdown_button`, menu_dropdown_list),
            menu_dropdown_textAll = selectAll(`.menu_dropdown_text`, menu_dropdown_list);

        for (let i = 0; i < chainsList.length; i++) {
            const
                [id, chain] = chainsList[i],
                chainSymbol = id as ChainIds,
                button = menu_dropdown_buttonAll[i] as HTMLButtonElement,
                menu_dropdown_iconAll = selectElement(`.menu_dropdown_icon`, button) as HTMLImageElement;

            menu_dropdown_iconAll.src = chain.logo;
            menu_dropdown_iconAll.alt = `${chain.chainName} chain logo`;
            menu_dropdown_textAll[i].textContent = chainSymbol;

            button.style.opacity = chain.deployed ? `1` : `0.3`;
            button.onclick = () => {
                if (chain.deployed) {
                    dropdownIcon0.src = chain.logo;
                    dropdownIcon1.src = `../assets/images/arrow_drop_down.svg`;
                    menu_dropdown_text.innerText = chainSymbol;
                    menu_dropdown_list.classList.add(`hide`);
                    initiate(chainSymbol);
                } else alert(`Not Supported!`);
            };
        };

        dropdownIcon0.src = chainsData[defaultChain]?.logo;
        dropdownIcon0.alt = `${chainsData[defaultChain]?.chainName} chain logo`;
        dropdownIcon1.src = `../assets/images/arrow_drop_down.svg`;
        menu_dropdown_text.innerText = defaultChain;
    };

console.log(
    `MIT License. \n`
    + `Source Code https://github.com/MerchantSlate/Website \n`
    + `\nWelcome To MerchantSlate!\n `
);

export {
    menu_buttons,
    listChains,
    textStrings,
}