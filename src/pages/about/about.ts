import { select } from "../../code/selectors";

const
    menu_connect = select(`.menu_connect`);

menu_connect.innerText = `Dashboard`;
menu_connect.onclick = () => window.location.href = '/app';