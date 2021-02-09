/**
 * Файл настройки работы фронта на стенде
 *
 * Важные параметры которые нужно обязательно менять при переносе на новый стенд
 *
 *  - API_HOST - базовый адрес API
 *  - MATOMO_URL - адрес сервиса мониторинга MATOMO
 *  - X_APP_NAME - имя приложения
 * */

 (function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals
        root.FRIEND_APP = factory();
    }
}(typeof self !== 'undefined' ? self : this, function (b) {
    /**
     * Хост к API в формате `https://{host}` (без / в конце)
     * или `""` пусто если сч на том же хосте 
     */
    // CHANGE ME
    const API_HOST = ""; // empty for same host as static files
    const API_PATH = "/sberfriend-api/api/v1/ext";

    const BASE_CONTEXT = API_HOST + API_PATH;

    return Object.freeze({
        // #
        // # Main app settings
        // #

        // # Standard app title
        FRIENDLY_NAME: "Сбердруг",

        // CHANGE ME
        // Значение заголовка X_APP_NAME, необходим для корректной работы СЧ
        // X_APP_NAME: "SberDRUG-efs-alpha",
        // X_APP_NAME: "SberDRUG-efs-sigma",
        X_APP_NAME: "SberDRUG-efs-sigma",

        // server contexts
        
        API_HOST: API_HOST,
        API_PATH: API_PATH,
        BASE_CONTEXT: BASE_CONTEXT,
        FRIEND_CONTEXT: BASE_CONTEXT + "/app/friend/rest/state/json/friendservice.rpc",
        ADDRESSBOOK_APP_CONTEXT_API: BASE_CONTEXT + "/app/friend/rest/sd/addressbook/api",
        APPROVALS_CONTEXT_API: BASE_CONTEXT + "/app/approvals/approvals-service/api",
        AUTOEXECUTOR_PROXY_CONTEXT: BASE_CONTEXT + "/app/friend/rest/state/json/friendservice.rpc",
        CATALOG_CONTEXT_API: BASE_CONTEXT + "/app/catalog/sberdrug/api",
        CHATBOT_CONTEXT_API: BASE_CONTEXT + "/app/chatbot",
        CONTEXT_API: BASE_CONTEXT + "/app/friend",
        FILESTORAGE_PROXY_CONTEXT: BASE_CONTEXT + "/app/friend/rest/file-storage/api",
        GEOSERVICE_PROXY_CONTEXT: BASE_CONTEXT + "/app/friend/rest/state/json/friendservice.rpc",
        OPERATIONS_CONTEXT: BASE_CONTEXT + "/app/operations",
        SBERDRUG_CONTEXT_API: BASE_CONTEXT + "/app/friend/rest/sberdrug/api", // wtf we use sberdrug inside old server?
        SEARCH_CONTEXT_API: BASE_CONTEXT + "/app/se/search-engine/api/v1",
        SEARCH_CONTEXT_API_V2: BASE_CONTEXT + "/app/se/search-engine/api/v2",
        SIGNSERVICE_PROXY_CONTEXT: BASE_CONTEXT + "/app/friend/rest/state/json/sign.rpc",
        YANDEX_PROXY_CONTEXT: BASE_CONTEXT + "/app/friend/rest/state/json/maps.rpc",
        FEEDBACK_API: BASE_CONTEXT + "/app/feedback",
        TASK_CONTEXT: BASE_CONTEXT + "/app/tasks",

        // external contexts
        
        MATOMO_URL: "https://pvse-sccm0004.sigma.sbrf.ru/",
        

        // options    
        CHATBOT_DEFAULT_TIMEOUT: 15000,
        FACE1_RELATIVE_URL: false,
        PCI_DSS_CRYPTOGRAPHY: "RSA-OAEP",
        SELF_REDIRECT_QUERY: "updateSelfRedirect",

        // features
        I18N: true,

        // chantbot
        XMPP_CHATBOT_NAME: "Ассистент Сбердруга",
        XMPP_CHATBOT_TEMPLATE_NAME: "Ассистент Шаблонов",
        FRIEND_CHATBOT_CHECK_ROLE: true
    });
}));
