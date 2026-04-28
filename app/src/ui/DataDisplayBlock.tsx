import type dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

interface DataDisplayBlockProps {
  title: string;
  selectedDate: dayjs.Dayjs;
  handleChangeDate: (newValue: dayjs.Dayjs | null) => void;
  data: string;
  loading: boolean;
  error: string | null;
  successMessage: string;
  isCompleted: boolean;
  noDataMessage: string;
  fetchData: () => void;
  downloadData: () => void;
}

function DataDisplayBlock({
  title,
  selectedDate,
  handleChangeDate,
  data,
  loading,
  error,
  successMessage,
  isCompleted,
  noDataMessage,
  fetchData,
  downloadData,
}: DataDisplayBlockProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        maxWidth="lg"
        sx={{
          marginY: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardContent sx={{ width: "100%" }}>
            <Stack
              width="100%"
              direction="row"
              spacing={4}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">{title}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleChangeDate}
                  disabled={loading}
                  disableFuture
                />
                <Button
                  onClick={fetchData}
                  loading={loading}
                  variant="contained"
                >
                  Fetch Data
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {isCompleted && (
          <Alert severity={error ? "error" : "success"}>
            {error || successMessage}
          </Alert>
        )}
        {data ? (
          <Stack width="100%" spacing={2}>
            <Stack
              width="100%"
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">
                Daily Price Data for {selectedDate.format("YYYY-MM-DD")}
              </Typography>
              <Button
                onClick={downloadData}
                disabled={loading}
                variant="outlined"
              >
                Download Data
              </Button>
            </Stack>

            <Typography whiteSpace="pre-wrap">{data}</Typography>
          </Stack>
        ) : (
          <Typography variant="body1" color="textSecondary">
            {noDataMessage}
          </Typography>
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default DataDisplayBlock;

export type { DataDisplayBlockProps };
