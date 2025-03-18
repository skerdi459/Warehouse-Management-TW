export class HolderAPI {
    static readonly USER_BASE_URL = "/task/users";
    static readonly USER_CREATE = `${HolderAPI.USER_BASE_URL}/create-user`;
    static readonly USER_DELETE = `${HolderAPI.USER_BASE_URL}/{id}/soft-delete`;
    static readonly USER_EDIT = `${HolderAPI.USER_BASE_URL}/{id}/edit`;
    static readonly USER_FIND = `${HolderAPI.USER_BASE_URL}/search`;


    static readonly ITEM_BASE_URL = "/task/items";
    static readonly ITEM_CREATE = `${HolderAPI.ITEM_BASE_URL}/create-item`;
    static readonly ITEM_DELETE = `${HolderAPI.ITEM_BASE_URL}/{id}/soft-delete`;
    static readonly ITEM_EDIT = `${HolderAPI.ITEM_BASE_URL}/{id}/edit`;
    static readonly ITEM_FIND = `${HolderAPI.ITEM_BASE_URL}/search`;
    static readonly ITEM_FINDALL = `${HolderAPI.ITEM_BASE_URL}/findAll`;



    static readonly TRUCK_BASE_URL = "/task/trucks";
    static readonly TRUCK_CREATE = `${HolderAPI.TRUCK_BASE_URL}/create-truck`;
    static readonly TRUCK_DELETE = `${HolderAPI.TRUCK_BASE_URL}/{id}/soft-delete`;
    static readonly TRUCK_EDIT = `${HolderAPI.TRUCK_BASE_URL}/{id}/edit`;
    static readonly TRUCK_FIND = `${HolderAPI.TRUCK_BASE_URL}/search`;

    static readonly ORDER_BASE_URL = "/task/orders";
    static readonly ORDER_CREATE = `${HolderAPI.ORDER_BASE_URL}/create-order`;
    static readonly ORDER_DELETE = `${HolderAPI.ORDER_BASE_URL}/{id}/soft-delete`;
    static readonly ORDER_EDIT = `${HolderAPI.ORDER_BASE_URL}/edit`;
    static readonly ORDER_FIND = `${HolderAPI.ORDER_BASE_URL}/search`;
    static readonly ORDER_SUBMIT = `${HolderAPI.ORDER_BASE_URL}/{orderNumber}/submit`;
    static readonly ORDER_APPROVE = `${HolderAPI.ORDER_BASE_URL}/{orderNumber}/approve`;
    static readonly ORDER_CANCEL = `${HolderAPI.ORDER_BASE_URL}/{orderNumber}/cancel`;
    static readonly ORDER_DECLINE = `${HolderAPI.ORDER_BASE_URL}/{orderNumber}/decline`;
    static readonly ORDER_FINDBY_DATE_STATUS = `${HolderAPI.ORDER_BASE_URL}/search/{date}`;

    static readonly SCHEDULE_BASE_URL = "/task/schedule";
    static readonly SCHEDULE_CREATE = `${HolderAPI.SCHEDULE_BASE_URL}/create-schedule`;
    static readonly SCHEDULE_FIND = `${HolderAPI.SCHEDULE_BASE_URL}/search`;




}