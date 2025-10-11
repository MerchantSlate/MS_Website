
import { build } from "degreesign"
import dotenv from 'dotenv';
dotenv.config();

const
    isDevelopment = process.env.DEVELOPMENT_ENV == `true`,
    websiteName = `MerchantSlate`,
    websiteTitle = `instant payments for merchants`;

module.exports = build({
    type: `webapp`,
    openAnalyzer: !isDevelopment,
    mode: `production`,
    appShortName: `Merchant`,
    websiteName,
    websiteDomain: `merchantslate.com`,
    publishedTime: `2025-01-03T18:19:05+01:00`,
    author: `MerchantSlate Team`,
    websiteTitle,
    websiteDescription: `MerchantSlate instant payments for merchants with a built-in complete database`,
    coverImage: `merchant_slate_cover.webp`,
    coverImageDescription: `Screenshot of ${websiteName}\' ${websiteTitle}`,
    background_color: `#fefefe`,
    theme_color: '#785afb',
    app_icon: `app_icon.png`,
    orientation: 'portrait',
    pagesList: [{
        uri: `home`,
        name: `MerchantSlate`,
        short_name: `MerchantSlate`,
        description: `MerchantSlate`,
        shortcut: true,
    }, {
        uri: `about`,
        name: `About`,
        short_name: `About`,
        description: `About MerchantSlate`,
        shortcut: true,
    }],
    htmlCommonElements: [`menu`, `footer`],
    obfuscateON: false,

    // directories
    srcDir: `src`,
    assetsDir: `assets`,
    commonDir: `common`,
    imagesDir: `images`,
    pagesDir: `pages`,
    pageHome: `home`,
    productionDir: isDevelopment ? `build` : `public_html`,

    twitterUserName: `merchantslate`,
    htaccessCustom: ``,
    fav_icon: `favicon.ico`,
});