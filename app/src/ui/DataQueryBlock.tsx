import type dayjs from "dayjs";
import { DATA_TYPE_TO_DATE_TYPE_MAP, DATA_TYPES, DATE_TYPES, type DataType, type DateType } from "../constants";
import Stack from "@mui/material/Stack";
import type { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DateView } from "@mui/x-date-pickers/models";

interface DataQueryBlockProps {
    selectedDataType: DataType;
    onChangeDataType: (value: DataType) => void;

    selectedDate: dayjs.Dayjs;
    onChangeDate: (newValue: dayjs.Dayjs | null) => void;

    isLoading: boolean;
}

const DataTypeLabelMap: Record<DataType, string> = {
    [DATA_TYPES.DAILY_PRICE]: "日價格",
    [DATA_TYPES.MONTHLY_REVENUE]: "月營收",
} as const;

const DateTypeToViewAndLabelMap: Record<DateType, { views: DateView[]; label: string }> = {
    [DATE_TYPES.DAILY]: { views: ["year", "month", "day"], label: "選擇日期" },
    [DATE_TYPES.MONTHLY]: { views: ["year", "month"], label: "選擇月份" },
} as const;

function DataQueryBlock({
    selectedDataType,
    onChangeDataType,
    selectedDate,
    onChangeDate,
    isLoading,
}: DataQueryBlockProps) {
    const currentDateType = DATA_TYPE_TO_DATE_TYPE_MAP[selectedDataType];

    const handleDataTypeChange = (event: SelectChangeEvent<DataType>) => {
        onChangeDataType(event.target.value);
    }

    const shouldDisableDate = (date: dayjs.Dayjs) => {
        if (currentDateType === DATE_TYPES.DAILY) {
            return date.day() === 0 || date.day() === 6; // Disable weekends
        }
        return false;
    }

    const { views, label } = DateTypeToViewAndLabelMap[currentDateType];

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <FormControl sx={{ flex: 1 }}>
                <InputLabel id="data-type-label">資料類型</InputLabel>
                <Select<DataType>
                    labelId="data-type-label"
                    value={selectedDataType}
                    onChange={handleDataTypeChange}
                    disabled={isLoading}
                >
                    {Object.values(DATA_TYPES).map((type) => (
                        <MenuItem key={type} value={type}>
                            {DataTypeLabelMap[type]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <DatePicker
                label={label}
                value={selectedDate}
                onChange={onChangeDate}
                disabled={isLoading}
                disableFuture
                shouldDisableDate={shouldDisableDate}
                views={views}
                sx={{ flex: 1 }}
            />
        </Stack>
    )
}

export default DataQueryBlock;