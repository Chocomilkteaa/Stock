import type dayjs from "dayjs";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { DataTypeLabelMap, type DataType } from "../constants";
import DataQueryBlock from "./DataQueryBlock";

interface DataDisplayBlockProps {
  title: string;

  selectedDataType: DataType;
  onChangeDataType: (newValue: DataType) => void;

  selectedDate: dayjs.Dayjs;
  onChangeDate: (newValue: dayjs.Dayjs | null) => void;

  isLoading: boolean;
  isCompleted: boolean;

  data: string;
  error: string | null;
  successMessage: string;
  noDataMessage: string;

  fetchData: () => void;
  downloadData: () => void;
}

function DataDisplayBlock({
  title,
  selectedDataType,
  onChangeDataType,
  selectedDate,
  onChangeDate,
  isCompleted,
  isLoading,
  data,
  error,
  successMessage,
  noDataMessage,
  fetchData,
  downloadData,
}: DataDisplayBlockProps) {
  return (
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
            <DataQueryBlock
              selectedDataType={selectedDataType}
              onChangeDataType={onChangeDataType}
              selectedDate={selectedDate}
              onChangeDate={onChangeDate}
              isLoading={isLoading}
              fetchData={fetchData}
            />
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
              {`${DataTypeLabelMap[selectedDataType]} (${selectedDate.format("YYYY-MM-DD")})`}
            </Typography>
            <Button
              onClick={downloadData}
              disabled={isLoading}
              variant="outlined"
            >
              下載資料
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
  );
}

export default DataDisplayBlock;

export type { DataDisplayBlockProps };
