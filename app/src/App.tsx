import useDailyPriceData from "./hook/useDailyPriceData";
import DailyPriceBlock from "./ui/DailyPriceBlock";

function App() {
  const {
    selectedDate,
    handleChangeDate,
    dailyPriceData,
    getDailyPriceData,
    loading,
    error,
    isCompleted,
    downloadDailyPriceData,
  } = useDailyPriceData();

  return (
    <DailyPriceBlock
      title="SII + OTC Daily Price Data"
      selectedDate={selectedDate}
      handleChangeDate={handleChangeDate}
      data={dailyPriceData}
      loading={loading}
      error={error}
      successMessage={`Daily Price Data for ${selectedDate.format("YYYY-MM-DD")} fetched successfully`}
      isCompleted={isCompleted}
      noDataMessage="No data available"
      fetchData={getDailyPriceData}
      downloadData={downloadDailyPriceData}
    />
  );
}

export default App;
