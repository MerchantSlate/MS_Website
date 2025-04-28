const
    { build } = require(`degreesign`),
    websiteName = `MerchantSlate`,
    websiteTitle = `instant payments for merchants`;

module.exports = build({
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
    notificationTitle: `MerchantSlate Notification`,
    notificationText: `You have a new notification!`,
    background_color: `#fefefe`,
    theme_color: '#785afb',
    app_icon: `app_icon.png`,
    orientation: 'portrait',
    pagesList: [{
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
    developDir: `build`,
    commonDir: `common`,
    imagesDir: `images`,
    pagesDir: `pages`,
    pageHome: `home`,
    productionDir: `public_html`,
});