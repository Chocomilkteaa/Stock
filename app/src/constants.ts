const DATE_TYPES = {
    DAILY: "daily",
    MONTHLY: "monthly",
} as const;

type DateType = typeof DATE_TYPES[keyof typeof DATE_TYPES];

const DATA_TYPES = {
    DAILY_PRICE: "daily_price",
    MONTHLY_REVENUE: "monthly_revenue",
} as const;

type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];

const DATA_TYPE_TO_DATE_TYPE_MAP: Record<DataType, DateType> = {
    [DATA_TYPES.DAILY_PRICE]: DATE_TYPES.DAILY,
    [DATA_TYPES.MONTHLY_REVENUE]: DATE_TYPES.MONTHLY,
};

const DataTypeLabelMap: Record<DataType, string> = {
    [DATA_TYPES.DAILY_PRICE]: "日價格",
    [DATA_TYPES.MONTHLY_REVENUE]: "月營收",
} as const;

export { DATE_TYPES, DATA_TYPES, DATA_TYPE_TO_DATE_TYPE_MAP, DataTypeLabelMap };
export type { DateType, DataType };