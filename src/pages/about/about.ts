import { selectElement } from "@degreesign/ui";
import { updateFooter } from "../../code/footer";
import '../../styles.css';
import { getConfig } from "merchantslate";

updateFooter(`about`);

const
    data = getConfig(),
    contractBu = selectElement(`.cta_button_contract`) as HTMLLinkElement;
contractBu.href = `https://bscscan.com/address/${data.merchantSlateContract}#code`;