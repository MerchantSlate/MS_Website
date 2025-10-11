import '../../styles.css';
import { ChainIds, selectedChain } from "merchantslate";
import { initiate } from "../../code/methods";

initiate(process.env.CONTRACT_CHAIN as ChainIds || selectedChain);