import {
    ChainIds,
    EVMAddress,
    ErrorResponse,
    PaymentData,
    ProductChain,
    ProductData,
    ZERO_ADDRESS,
    config,
    deleteProduct,
    fromWei,
    getBrowserWallet,
    getChainsData,
    getMerchantId,
    getProvider,
    getWalletAddress,
    loadPayments,
    loadProducts,
    merchantFeeValueText,
    merchantSignup,
    offerStake,
    payProduct,
    payValueText,
    processNumbers,
    productFeeText,
    removeStakeOffer,
    setSelectedChain,
    stakesCount,
    stakesOffered,
    takeStake,
    toWei,
    totalStakes,
    transferStake,
    truncateText,
    updateProduct
} from "merchantslate"
import { itemUnit } from './ui';
import { listChains } from './menu';
import { getCurrentPage } from "./footer";
import { repeatElements, selectAll, selectElement } from "@degreesign/ui";

type ListType = `payments` | `products`;

let
    onlyMyPayments = false,
    onlyMyStakes = false,
    isMerchantPayments = false,
    isMerchantProducts = false,
    pageNoCurrentProducts = `0`;

const
    isStakes = getCurrentPage() == `stakes`,
    menu_connect = selectElement(`.menu_connect`),
    processError = (error: ErrorResponse) => {
        alert(error?.errorNote);
        return undefined
    },
    processHash = (hash?: string | ErrorResponse) => {
        if (typeof hash == `string`) {
            setTimeout(() => alert(`Transaction successful\n${hash}`));
            return hash
        } else {
            setTimeout(() => alert(`Transaction failed! ${hash?.errorNote}`));
        };
        return undefined
    },
    prod_add = selectElement(`.prod_add`),
    payment_section = selectElement(`.payment_section`),
    payments_list = selectElement(`.payments_list`),
    product_section = selectElement(`.product_section`),
    products_list = selectElement(`.products_list`),

    // toggle
    toggle_frame = selectAll(`.toggle_frame`),
    toggle_button_left = selectAll(`.toggle_button_left`),
    toggle_button_right = selectAll(`.toggle_button_right`),

    // me
    toggle_switch_frame = selectAll(`.toggle_switch_frame`),
    toggle_switch = selectAll(`.toggle_switch`),

    // pagination
    unit_page_left = selectAll(`.unit_page_left`),
    unit_page_no = selectAll(`.unit_page_no`),
    unit_page_total = selectAll(`.unit_page_total`),
    unit_page_right = selectAll(`.unit_page_right`),

    // stake list
    stakes_section = selectElement(`.stakes_section`),
    stakes_section_distribution = selectElement(`.stakes_section_distribution`),
    stakes_list = selectElement(`.stakes_list`),
    stakes_distribution = selectElement(`.stakes_distribution`),

    // page size defaults
    pageSizeDefaultProducts = `3`,
    pageSizeDefaultPayments = `2`,
    listType = (
        chain: ChainIds,
        listType: ListType,
        merchantId: string,
    ) => {
        const
            index = listType == `products` ? 1 : 0,
            left = toggle_button_left[index] as HTMLButtonElement,
            right = toggle_button_right[index] as HTMLButtonElement;

        (toggle_frame[index] as HTMLDivElement).style.display = +merchantId ? `flex` : `none`;

        left.onclick = () => {
            left.classList.add(`toggle_button_selected`);
            right.classList.remove(`toggle_button_selected`);
            if (listType == `products`) {
                isMerchantProducts = false;
                loadProductsMethod(chain);
            } else {
                isMerchantPayments = false;
                loadPaymentsMethod(chain);
            };
        };

        right.onclick = () => {
            right.classList.add(`toggle_button_selected`);
            left.classList.remove(`toggle_button_selected`);
            if (listType == `products`) {
                isMerchantProducts = true;
                loadProductsMethod(chain);
            } else {
                isMerchantPayments = true;
                loadPaymentsMethod(chain);
            };
        };
    },
    merchantUpdate = async (chain: ChainIds, merchantId: string = `0`) => {
        menu_connect.innerText = +merchantId ? `Id #${merchantId}`
            : `Signup`;
        menu_connect.onclick = () => +merchantId ? {}
            : merchantSignupMethod(chain);
        listType(chain, `payments`, merchantId);
        listType(chain, `products`, merchantId);
        prod_add.style.display = +merchantId ? `flex` : `none`;
        prod_add.onclick = () => addProduct(chain);
    },
    toggleUpdate = async (
        chain: ChainIds,
        type: `payments` | `stakes`,
    ) => {
        if (type == `payments`) {
            onlyMyPayments = !onlyMyPayments;
        } else if (type == `stakes`) {
            onlyMyStakes = !onlyMyStakes;
        };
        const
            index = type == `payments` ? 0 : 1,
            check = type == `payments` ? onlyMyPayments : onlyMyStakes;
        check ? toggle_switch[index].classList.add(`toggle_switch_selected`)
            : toggle_switch[index].classList.remove(`toggle_switch_selected`);
        type == `payments` ? loadPaymentsMethod(chain)
            : loadStakes(chain);
    },
    addProduct = async (
        chain: ChainIds,
    ): Promise<void> => {
        const res = await productFeeText(chain);
        if (!res?.success) return processError(res);
        const confirmed = confirm(`New Product Fee ${res?.data}`);
        if (confirmed) updateProductMethod({ chain });
    },
    updateProductMethod = async ({
        chain,
        productId,
    }: {
        chain: ChainIds,
        productId?: string,
    }): Promise<void> => {
        const productPrice = prompt(`Enter product price`);
        if (!productPrice) {
            alert(`Price is required.`);
            return;
        };

        const
            tokenAddress = prompt(`Enter token address (default = native)`) as EVMAddress,
            quantity = prompt(`Enter product quantity (default = unlimited)`) || `0`,
            commissionAddress = prompt(`Enter commission address (optional)`) as EVMAddress,
            commissionPercentage = prompt(`Enter commission percentage (0-100)`) || `0`,
            res = await updateProduct({
                chain,
                productId,
                productPrice,
                tokenAddress,
                quantity,
                commissionAddress,
                commissionPercentage,
            });
        if (!res?.success) return processError(res);

        const {
            productId: productIdReturned,
            hash,
            isNew,
        } = res?.data;
        if (!isNew) {
            loadProductsMethod(chain, pageNoCurrentProducts);
            alert(`Product #${productId} updated successfully!`);
        } else {
            loadProductsMethod(chain);
            alert(`Product #${productIdReturned} added successfully!`);
        };
    },
    deleteProductMethod = async (
        chain: ChainIds,
        productId: string
    ): Promise<void> => {
        const confirmation = confirm(`Are you sure you want to delete product #${productId}?`);
        if (confirmation) {
            const res = await deleteProduct(chain, productId);
            if (!res?.success) return processError(res);
            loadProductsMethod(chain, pageNoCurrentProducts);
            alert(`Product #${productId} deleted successfully!`);
        };
    },
    merchantSignupMethod = async (
        chain: ChainIds,
    ): Promise<number | undefined> => {

        const res = await merchantFeeValueText(chain);
        if (!res?.success) return processError(res);

        const confirmed = confirm(`Merchant Signup Fee ${res?.data}`);
        if (confirmed) {
            const res = await merchantSignup(chain);
            if (!res?.success) return processError(res);
            const { hash, merchantId } = res?.data;
            merchantUpdate(chain, merchantId);
            alert(`Congratulations, you are now a merchant!`);
        };
    },
    payProductMethod = async (
        chain: ChainIds,
        product: ProductChain,
    ) => {
        const
            productId = product.id,
            quantity = prompt(`Enter product quantity (default = 1)`) || `1`,
            text = await payValueText(
                chain,
                product,
                quantity,
            );
        if (typeof text != `string`) return

        const confirmed = confirm(`Product Payment ${text}`);
        if (confirmed) {
            const res = await payProduct(chain, product, quantity);
            if (!res?.success) return processError(res);
            const { hash, paymentId } = res?.data;
            loadPaymentsMethod(chain);
            if (product.qtyCap) loadProductsMethod(chain, pageNoCurrentProducts);
            alert(`Product #${productId} paid successfully! Payment #${paymentId}`);
        };
    },
    /** Payment Unit */
    paymentUnit = async ({
        unit_frame,
        payment,
    }: {
        unit_frame: any,
        payment: PaymentData,
    }) => {
        const
            {
                chainLogoImg,
                chainLogoAlt,
                tokenLogoImg,
                tokenLogoAlt,
                paymentIdText,
                paymentTime,
                buyerAddressTxt,
                paidPrice,
                paidTotal,
                paidQty,
                paidFee,
            } = payment;

        itemUnit({
            unit_frame,
            gridDataBottom: [{
                text: paidPrice,
                label: `Price`,
            }, {
                text: paidTotal,
                label: `Total`,
            }, {
                text: paidQty,
                label: `Quantity`,
            }, {
                text: paidFee,
                label: `Fee 0.1%`,
            }],
            tokenLogoImg,
            tokenLogoAlt,
            chainLogoImg,
            chainLogoAlt,
            mainText: paymentIdText,
            subText: buyerAddressTxt,
            footerText: paymentTime,
        });
    },
    /** Product Unit */
    productUnit = async ({
        unit_frame,
        product,
    }: {
        unit_frame: any,
        product: ProductData,
    }) => {
        const
            {
                product: productDetails,
                isRemoved,
                chainLogoImg,
                chainLogoAlt,
                tokenLogoImg,
                tokenLogoAlt,
                productIdText,
                productPrice,
                productQuantity,
            } = product,
            productId = productDetails.id,
            chain = productDetails.chain;

        itemUnit({
            unit_frame,
            unitCover: isRemoved ? `Deleted Product` : ``,
            gridDataTop: [{
                text: productPrice,
                label: `Price`,
            }, {
                text: productQuantity,
                label: `Stock`,
            }],
            tokenLogoImg,
            tokenLogoAlt,
            chainLogoImg,
            chainLogoAlt,
            mainText: productIdText,
            mainButtonText: isMerchantProducts ? `Update` : `Pay Now`,
            mainButtonAction: () =>
                isMerchantProducts ? updateProductMethod({ chain, productId })
                    : payProductMethod(chain, productDetails),
            squareButtonLogo: isMerchantProducts ? `./assets/images/delete_icon.svg` : ``,
            squareButtonLogoAlt: `Delete icon`,
            squareButtonDescription: `Delete Product`,
            squareButtonAction: () => deleteProductMethod(chain, productId),
            isShort: true,
        })
    },
    updatePagination = ({
        listType,
        currentPage,
        previousPage,
        nextPage,
        totalPages,
        fun,
    }: {
        listType: ListType,
        currentPage: string,
        previousPage?: string,
        nextPage?: string,
        totalPages: string,
        fun: Function,
    }) => {

        try {
            const
                index = listType == `payments` ? 0 : 1,
                left = unit_page_left[index] as HTMLButtonElement,
                right = unit_page_right[index] as HTMLButtonElement;
            previousPage == undefined ? left.classList.add(`disable`)
                : left.classList.remove(`disable`);
            nextPage == undefined ? right.classList.add(`disable`)
                : right.classList.remove(`disable`);
            unit_page_total[index].textContent = totalPages;
            unit_page_no[index].textContent = currentPage;
            left.onclick = () => previousPage == undefined ? {}
                : fun(previousPage);
            right.onclick = () => nextPage == undefined ? {}
                : fun(nextPage);
        } catch (e) {

        };
    },
    loadProductsMethod = async (
        chain: ChainIds,
        pageNo = `0`,
        pageSize = pageSizeDefaultProducts,
    ): Promise<void> => {
        pageNoCurrentProducts = pageNo;
        try {

            const
                data = await loadProducts({
                    chain,
                    pageNo,
                    pageSize,
                    isMerchantOnly: isMerchantProducts
                }),
                products = data?.productsData;

            // repeat elements
            let productUnits = selectAll(`.unit_frame`, products_list);
            repeatElements({
                targetCount: products?.length,
                parent: products_list,
                children: productUnits
            });
            productUnits = selectAll(`.unit_frame`, products_list);

            // render products
            if (products?.length)
                for (let index = 0; index < products.length; index++)
                    productUnit({
                        unit_frame: productUnits[index],
                        product: products[index],
                    });

            // no products
            else itemUnit({
                unit_frame: productUnits[0],
                unitCover: `No Products`,
                isShort: true,
            });

            updatePagination({
                listType: `products`,
                ...data,
                fun: (newPage: string) =>
                    loadProductsMethod(chain, newPage, pageSize),
            });
        } catch (error) {
            console.log(`Error loading products: `, error);
        };
    },

    loadPaymentsMethod = async (
        chain: ChainIds,
        pageNo = `0`,
        pageSize = pageSizeDefaultPayments,
    ): Promise<void> => {

        try {

            const
                data: {
                    currentPage: string;
                    previousPage?: string;
                    nextPage?: string;
                    totalPages: string;
                    paymentsData: PaymentData[];
                } = await loadPayments({
                    chain,
                    pageNo,
                    pageSize,
                    isMerchantOnly: isMerchantPayments,
                    buyerWallet: onlyMyPayments ? await getWalletAddress(chain) : undefined,
                }),
                payments = data?.paymentsData;

            // repeat elements
            let paymentUnits = selectAll(`.unit_frame`, payments_list);
            repeatElements({
                targetCount: payments?.length,
                parent: payments_list,
                children: paymentUnits
            });
            paymentUnits = selectAll(`.unit_frame`, payments_list);

            // render payments
            if (payments?.length)
                for (let index = 0; index < payments.length; index++)
                    paymentUnit({
                        unit_frame: paymentUnits[index],
                        payment: payments[index]
                    });

            // no payments
            else itemUnit({
                unit_frame: paymentUnits[0],
                unitCover: `No Payments`,
            });

            updatePagination({
                listType: `payments`,
                ...data,
                fun: (newPage: string) =>
                    loadPaymentsMethod(chain, newPage, pageSize),
            });
        } catch (error) {
            console.log(`Error loading products: `, error);
        }
    },
    offerStakeMethod = async (
        chain: ChainIds,
        holdings: number,
    ) => {
        const
            qty = prompt(`Stakes quantity to offer (max ${holdings})`),
            valuePerStake = prompt(`Value per stake`) || `0`;

        if (!qty || !+qty || !+valuePerStake) {
            alert(`Quantity and value per stake required`);
            return
        } else if (+qty > holdings) {
            alert(`Quantity exceeds holdings`);
            return
        };

        const res = await offerStake(
            chain,
            qty,
            toWei(valuePerStake)
        );
        if (!res?.success) return processError(res);
        loadStakes(chain);
        return res?.data
    },
    transferStakeMethod = async (
        chain: ChainIds,
        holdings: number,
    ) => {
        const
            qty = prompt(`Stakes quantity to transfer (max ${holdings})`) || `1`,
            to = (prompt(`Recipient address`) || ZERO_ADDRESS) as EVMAddress,
            res = await transferStake(chain, qty, to);
        if (!res?.success) return processError(res);
        const hash = res?.data;
        loadStakes(chain);
        processHash(hash);
        return hash
    },
    takeStakeMethod = async (
        chain: ChainIds,
        offerId: string,
        offerValue: string,
        nativeSymbol: string,
    ) => {
        const confirmed = confirm(
            `Take stake offer #${offerId} for ${nativeSymbol} `
            + processNumbers(fromWei(offerValue))
        );
        if (confirmed) {
            const res = await takeStake(chain, offerId);
            if (!res?.success) return processError(res);
            const hash = res?.data;
            loadStakes(chain);
            processHash(hash);
            return hash
        };
    },
    removeStakeOfferMethod = async (
        chain: ChainIds,
        offerId: string,
    ) => {
        const confirmed = confirm(`Remove stake offer #${offerId}`);
        if (confirmed) {
            const res = await removeStakeOffer(chain, offerId);
            if (!res?.success) return processError(res);
            loadStakes(chain);
            return res?.data
        };
    },
    loadStakes = async (
        chain: ChainIds
    ) => {
        // total stakes
        const totalStakesRes = await totalStakes(chain);
        if (!totalStakesRes?.success) return processError(totalStakesRes);

        // stake count
        const
            totalStakesNumber = totalStakesRes?.data,
            stakesCountRes = await stakesCount(chain),
            stakesCountNumber = stakesCountRes?.success ? stakesCountRes?.data : {
                holdings: 0,
                offered: 0
            },
            holdings = stakesCountNumber?.holdings || 0,
            offered = stakesCountNumber?.offered || 0,
            stakesOfferedObj = await stakesOffered(chain, onlyMyStakes),
            listedStakes = stakesOfferedObj?.listedStakes || {},
            stakesOfferedCount = Object.keys(listedStakes)?.filter(offerId =>
                !onlyMyStakes
                || listedStakes[offerId].isHolderOffer
            )?.length;

        // repeat elements
        let stakeOffers = selectAll(`.unit_frame`, stakes_list);
        repeatElements({
            targetCount: stakesOfferedCount,
            parent: stakes_list,
            children: stakeOffers
        });
        stakeOffers = selectAll(`.unit_frame`, stakes_list);

        if (!stakesOfferedCount) {
            itemUnit({
                isShort: true,
                unit_frame: stakeOffers[0],
                unitCover: `No Stake Offered`
            });
        } else {
            let index = 0;
            const nativeSymbol = getChainsData()[chain]?.nativeCurrency?.symbol;
            for (const offerId in listedStakes) {
                if (!onlyMyStakes || listedStakes[offerId]?.isHolderOffer) {
                    const offerValue = listedStakes[offerId]?.offerValue;
                    itemUnit({
                        isShort: true,
                        unit_frame: stakeOffers[index],
                        mainText: `#${offerId}`,
                        subText: `${nativeSymbol} ${processNumbers(fromWei(offerValue))}`,
                        mainButtonText: `Take Stake`,
                        mainButtonAction: () => takeStakeMethod(chain, offerId, offerValue, nativeSymbol),
                        ...onlyMyStakes ? {
                            squareButtonLogo: `./assets/images/delete_icon.svg`,
                            squareButtonLogoAlt: `Delete icon`,
                            squareButtonDescription: `Remove Stake Offer`,
                            squareButtonAction: () => removeStakeOfferMethod(chain, offerId),
                        } : {},
                    });
                    index++;
                };
            };
        };

        itemUnit({
            isShort: true,
            unit_frame: selectAll(`.unit_frame`, stakes_distribution)[0],
            mainText: `${holdings + offered} stakes `
                + `(${(100 * (holdings + offered) / totalStakesNumber)?.toFixed(1)}%) `
                + (offered ? `- offered (${offered})` : ``),
            subText: `Holdings - ${chain} Stakes (${totalStakesNumber})`,
            ...!holdings ? {} : {
                mainButtonText: `Offer Stake`,
                mainButtonAction: () => offerStakeMethod(chain, holdings),
                squareButtonLogo: `./assets/images/arrow_forward.svg`,
                squareButtonLogoAlt: `arrow forward icon`,
                squareButtonDescription: `Transfer Stake`,
                squareButtonAction: () => transferStakeMethod(chain, holdings),
            },
        });
    },
    initiateConnect = async (
        chain: ChainIds,
    ) => {
        menu_connect.innerText = `Connect`;
        const browserWallet = getBrowserWallet();
        if (browserWallet) getProvider(chain);
        menu_connect.onclick = async () => {
            let showMeToggle = false;
            if (!browserWallet) {
                const walletSeedPhrase = prompt(
                    `Only usable with desktop wallet extensions!`
                    + `\nFor advanced users enter seed phrase to continue`
                )?.trim();
                if (walletSeedPhrase) {
                    config({
                        walletSeedPhrase
                    });
                    const
                        address = await getWalletAddress(chain) || ``,
                        updateButtonText = (text?: string) => {
                            menu_connect.innerText = text || truncateText(address, 5);
                        };
                    updateButtonText();
                    menu_connect.classList.add(`disable`);
                    menu_connect.onclick = () => {
                        navigator.clipboard.writeText(address);
                        updateButtonText(`Copied!`);
                        setTimeout(updateButtonText, 2e3);
                    };
                    isStakes ? loadStakes(chain)
                        : (
                            loadPaymentsMethod(chain),
                            loadProductsMethod(chain)
                        );
                    showMeToggle = true;
                };
            } else {
                const merchantIdRes = await getMerchantId(chain);
                merchantUpdate(chain, merchantIdRes?.success ? merchantIdRes?.data : ``);
                showMeToggle = true;
            };
            if (showMeToggle) {
                (toggle_switch_frame[1] as HTMLDivElement).style.display =
                    (toggle_switch_frame[0] as HTMLDivElement).style.display = `flex`;
                (toggle_switch[1] as HTMLButtonElement).onclick = () => toggleUpdate(chain, `stakes`);
                (toggle_switch[0] as HTMLButtonElement).onclick = () => toggleUpdate(chain, `payments`);
            };
        };
    },
    initiate = async (
        chain: ChainIds
    ) => {

        setSelectedChain(chain);

        const unitFrame = selectElement(`.unit_frame`);

        if (!selectAll(`.unit_frame`, payments_list)?.length)
            payments_list.appendChild(unitFrame.cloneNode(true));

        if (!selectAll(`.unit_frame`, products_list)?.length)
            products_list.appendChild(unitFrame.cloneNode(true));

        if (!selectAll(`.unit_frame`, stakes_list)?.length)
            stakes_list.appendChild(unitFrame.cloneNode(true));

        if (!selectAll(`.unit_frame`, stakes_distribution)?.length)
            stakes_distribution.appendChild(unitFrame.cloneNode(true));

        const
            stakePage = () => {
                stakes_section.classList.remove(`hide`);
                stakes_section_distribution.classList.remove(`hide`);
                payment_section.classList.add(`hide`);
                product_section.classList.add(`hide`);
                loadStakes(chain);
            },
            homePage = () => {
                stakes_section.classList.add(`hide`);
                stakes_section_distribution.classList.add(`hide`);
                payment_section.classList.remove(`hide`);
                product_section.classList.remove(`hide`);
                loadPaymentsMethod(chain);
                loadProductsMethod(chain);
            };

        config({
            ARBITRUM_RPC: process.env.RPC_URL_ARBITRUM || ``,
            AVALANCHE_RPC: process.env.RPC_URL_AVALANCHE || ``,
            BSC_RPC: process.env.RPC_URL_BSC || ``,
            CELO_RPC: process.env.RPC_URL_CELO || ``,
            ETH_RPC: process.env.RPC_URL_ETH || ``,
            FANTOM_RPC: process.env.RPC_URL_FANTOM || ``,
            OPTIMISM_RPC: process.env.RPC_URL_OPTIMISM || ``,
            POLYGON_RPC: process.env.RPC_URL_POLYGON || ``,
            billionSuffix: `b`,
            millionSuffix: `m`,
            merchantSlateContract: process.env.CONTRACT_ADDRESS || ``,
        });

        listChains(chain, initiate);

        isStakes ? stakePage()
            : homePage();

        initiateConnect(chain);
    };

export {
    initiate
}