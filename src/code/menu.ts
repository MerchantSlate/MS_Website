import { BlockchainNetwork, ChainIds, getChainsData } from "merchantslate";
import { repeat, select, selectAllChild, selectChild } from "./selectors";

const
    menu_buttons = select(`.menu_buttons`),
    menu_dropdown_button = selectChild(`.menu_dropdown_button`, menu_buttons),
    menu_dropdown_icon = selectAllChild(`.menu_dropdown_icon`, menu_dropdown_button),
    menu_dropdown_text = selectChild(`.menu_dropdown_text`, menu_dropdown_button),
    menu_dropdown_list = select(`.menu_dropdown_list`),
    listChains = (
        defaultChain: ChainIds,
        initiate: (chain: ChainIds) => void,
    ) => {

        menu_dropdown_button.onclick = () => {
            if (menu_dropdown_list.classList.contains(`hide`)) {
                menu_dropdown_list.classList.remove(`hide`);
                menu_dropdown_icon[1].src = `../assets/images/arrow_drop_up.svg`;
            } else {
                menu_dropdown_list.classList.add(`hide`);
                menu_dropdown_icon[1].src = `../assets/images/arrow_drop_down.svg`;
            };
        };

        const
            chainsData = getChainsData(),
            chainsList: [string, BlockchainNetwork][] = Object.entries(chainsData)
        chainsList.sort((a, b) => a[1].deployed && !b[1].deployed ? -1 : 1);

        let menu_dropdown_button_wrapAll = selectAllChild(`.menu_dropdown_button_wrap`, menu_dropdown_list);
        repeat(chainsList?.length, menu_dropdown_list, menu_dropdown_button_wrapAll);

        const
            menu_dropdown_buttonAll = selectAllChild(`.menu_dropdown_button`, menu_dropdown_list),
            menu_dropdown_textAll = selectAllChild(`.menu_dropdown_text`, menu_dropdown_list);

        for (let i = 0; i < chainsList.length; i++) {
            const
                [id, chain] = chainsList[i],
                chainSymbol = id as ChainIds,
                button = menu_dropdown_buttonAll[i],
                menu_dropdown_iconAll = selectAllChild(`.menu_dropdown_icon`, button);

            menu_dropdown_iconAll[0].src = chain.logo;
            menu_dropdown_textAll[i].innerText = chainSymbol;

            button.style.opacity = chain.deployed ? 1 : 0.3;
            button.onclick = () => {
                if (chain.deployed) {
                    menu_dropdown_icon[0].src = chain.logo;
                    menu_dropdown_icon[1].src = `../assets/images/arrow_drop_down.svg`;
                    menu_dropdown_text.innerText = chainSymbol;
                    menu_dropdown_list.classList.add(`hide`);
                    initiate(chainSymbol);
                } else alert(`Not Supported!`);
            };
        };

        menu_dropdown_icon[0].src = chainsData[defaultChain]?.logo;
        menu_dropdown_icon[1].src = `../assets/images/arrow_drop_down.svg`;
        menu_dropdown_text.innerText = defaultChain;
    };

console.log(
    `MIT License. \n`
    + `Source Code https://github.com/MerchantSlate/Website \n`
    + `\nWelcome To MerchantSlate!\n `
);

export {
    menu_buttons,
    listChains
}