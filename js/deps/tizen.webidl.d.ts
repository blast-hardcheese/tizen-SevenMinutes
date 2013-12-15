declare enum FilterMatchFlag { "EXACTLY", "FULLSTRING", "CONTAINS", "STARTSWITH", "ENDSWITH", "EXISTS" }
declare enum SortModeOrder { "ASC", "DESC" }
declare enum CompositeFilterType { "UNION", "INTERSECTION" }
interface TizenObject {
    tizen: Tizen;
}

  interface Window extends TizenObject {}
interface Tizen {

}

interface AbstractFilter {

}

interface AttributeFilter extends AbstractFilter {
    attributeName: String;
    matchFlag: FilterMatchFlag;
    matchValue: any;
}

interface AttributeRangeFilter extends AbstractFilter {
    attributeName: String;
    initialValue: any;
    endValue: any;
}

interface CompositeFilter extends AbstractFilter {
    type: CompositeFilterType;
    filters: AbstractFilter[];
}

interface SortMode {
    attributeName: String;
    order: SortModeOrder;
}

interface SimpleCoordinates {
    latitude: Number;
    longitude: Number;
}

interface WebAPIException {
    code: Number;
    name: String;
    message: String;
    INDEX_SIZE_ERR: Number; // 1
    DOMSTRING_SIZE_ERR: Number; // 2
    HIERARCHY_REQUEST_ERR: Number; // 3
    WRONG_DOCUMENT_ERR: Number; // 4
    INVALID_CHARACTER_ERR: Number; // 5
    NO_DATA_ALLOWED_ERR: Number; // 6
    NO_MODIFICATION_ALLOWED_ERR: Number; // 7
    NOT_FOUND_ERR: Number; // 8
    NOT_SUPPORTED_ERR: Number; // 9
    INUSE_ATTRIBUTE_ERR: Number; // 10
    INVALID_STATE_ERR: Number; // 11
    SYNTAX_ERR: Number; // 12
    INVALID_MODIFICATION_ERR: Number; // 13
    NAMESPACE_ERR: Number; // 14
    INVALID_ACCESS_ERR: Number; // 15
    VALIDATION_ERR: Number; // 16
    TYPE_MISMATCH_ERR: Number; // 17
    SECURITY_ERR: Number; // 18
    NETWORK_ERR: Number; // 19
    ABORT_ERR: Number; // 20
    URL_MISMATCH_ERR: Number; // 21
    QUOTA_EXCEEDED_ERR: Number; // 22
    TIMEOUT_ERR: Number; // 23
    INVALID_NODE_TYPE_ERR: Number; // 24
    DATA_CLONE_ERR: Number; // 25
}

interface WebAPIError {
    code: Number;
    name: String;
    message: String;
}

interface SuccessCallback {
    onsuccess(): void;
}

interface ErrorCallback {
    onerror(error: WebAPIError): void;
}
