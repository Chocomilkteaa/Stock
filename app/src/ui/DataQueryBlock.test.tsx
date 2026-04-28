import { describe, it, expect, vi } from "vitest";
import { logRoles, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import DataQueryBlock from "./DataQueryBlock";
import { DATA_TYPES } from "../constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

describe("DataQueryBlock", () => {
    const defaultDate = dayjs("2024-04-01");
    const setup = (props?: Partial<React.ComponentProps<typeof DataQueryBlock>>) => {
        const onChangeDataType = vi.fn();
        const onChangeDate = vi.fn();
        const { container } = render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DataQueryBlock
                    selectedDataType={DATA_TYPES.DAILY_PRICE}
                    onChangeDataType={onChangeDataType}
                    selectedDate={defaultDate}
                    onChangeDate={onChangeDate}
                    isLoading={false}
                    {...props}
                />
            </LocalizationProvider>
        );
        logRoles(container);

        return { onChangeDataType, onChangeDate };
    };

    it("renders data type selector and date picker", () => {
        setup();

        expect(screen.getByRole("combobox", { name: /資料類型/u })).toBeInTheDocument();
        expect(screen.getByRole("group", { name: /選擇日期/u })).toBeInTheDocument();
    });

    it("shows correct label for daily price data type", () => {
        setup({ selectedDataType: DATA_TYPES.DAILY_PRICE });

        expect(screen.getByRole("group", { name: /選擇日期/u })).toBeInTheDocument();
    });

    it("shows correct label and month-only picker for monthly revenue data type", () => {
        setup({ selectedDataType: DATA_TYPES.MONTHLY_REVENUE });

        expect(screen.getByRole("group", { name: /選擇月份/u })).toBeInTheDocument();
    });

    it("calls onChangeDataType when data type is changed", async () => {
        const { onChangeDataType } = setup();
        const user = userEvent.setup();
        const select = screen.getByRole("combobox", { name: /資料類型/u });
        await user.click(select);
        const monthlyOption = await screen.findByText(/月營收/u);
        await user.click(monthlyOption);

        expect(onChangeDataType).toHaveBeenCalledWith(DATA_TYPES.MONTHLY_REVENUE);
    });

    it("calls onChangeDate when date is changed", async () => {
        const { onChangeDate } = setup();
        const user = userEvent.setup();
        const dateInput = screen.getByRole("group", { name: /選擇日期/u });
        await user.type(dateInput, "2024-04-15");
        // Simulate blur or enter to trigger onChange
        await user.tab();

        expect(onChangeDate).toHaveBeenCalled();
    });

    it("disables controls when loading", () => {
        setup({ isLoading: true });

        // For MUI Select
        const selectElement = screen.getByRole("combobox", { name: /資料類型/u });
        expect(selectElement).toHaveClass('Mui-disabled');
        // For MUI DatePicker
        const dateInput = screen.getByRole("group", { name: /選擇日期/u });
        expect(dateInput).toHaveClass('Mui-disabled');
    });
});