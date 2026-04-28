import dayjs from "dayjs";
import type { DataDisplayBlockProps } from "./DataDisplayBlock";
import { describe, expect, it, vi } from "vitest";
import DailyPriceBlock from "./DataDisplayBlock";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function setup(props?: Partial<DataDisplayBlockProps>) {
    const defaultProps: DataDisplayBlockProps = {
        title: "test title",
        selectedDate: dayjs(),
        handleChangeDate: vi.fn(),
        data: '',
        loading: false,
        error: null,
        successMessage: 'test success message',
        isCompleted: false,
        noDataMessage: 'No data available',
        fetchData: vi.fn(),
        downloadData: vi.fn(),
    };

    const mergedProps = { ...defaultProps, ...props };
    render(<LocalizationProvider dateAdapter={AdapterDayjs}><DailyPriceBlock {...mergedProps} /></LocalizationProvider>);

    return {
        props: mergedProps,
        user: userEvent.setup()
    }
}

describe("DailyPriceBlock", () => {
    it("should render the title and fetch action", () => {
        const { props } = setup();

        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /fetch data/i })).toBeInTheDocument();
    });

    it("should call fetchData when the fetch button is clicked", async () => {
        const { props, user } = setup();

        const fetchButton = screen.getByRole("button", { name: /fetch data/i });
        await user.click(fetchButton);

        expect(props.fetchData).toHaveBeenCalled();
    });

    it("should display loading state", () => {
        setup({ loading: true });

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should display success alert when isCompleted is true and there is no error", () => {
        const successMessage = "Data fetched successfully!";
        setup({ isCompleted: true, error: null, successMessage });

        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(successMessage);
    });

    it("should display error alert when isCompleted is true and there is an error", () => {
        const errorMessage = "Failed to fetch data!";
        setup({ isCompleted: true, error: errorMessage });

        const alert = screen.getByRole("alert");
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(errorMessage);
    });

    it('should not display alert when isCompleted is false', () => {
        setup({ isCompleted: false, error: "Some error", successMessage: "Some success" });

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should display data and download button when data exists", () => {
        const testData = JSON.stringify({ key: "value" }, null, 2);
        setup({ data: testData });

        expect(screen.getByText(/"key": "value"/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /download data/i })).toBeInTheDocument();
    });

    it("should call downloadData when the download button is clicked", async () => {
        const testData = JSON.stringify({ key: "value" }, null, 2);
        const { props, user } = setup({ data: testData });

        const downloadButton = screen.getByRole("button", { name: /download data/i });
        await user.click(downloadButton);

        expect(props.downloadData).toHaveBeenCalled();
    });

    it("should disable download button when loading is true", () => {
        const testData = JSON.stringify({ key: "value" }, null, 2);
        setup({ data: testData, loading: true });

        const downloadButton = screen.getByRole("button", { name: /download data/i });
        expect(downloadButton).toBeDisabled();
    });
});