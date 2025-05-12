import { ChainIds, selectedChain } from "merchantslate";
import { initiate } from "../../code/methods";
import '../../styles.css';

initiate(process.env.CONTRACT_CHAIN as ChainIds || selectedChain);