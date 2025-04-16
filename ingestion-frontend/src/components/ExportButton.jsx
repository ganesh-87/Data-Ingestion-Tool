import { exportTable } from "../api.js";

const ExportButton = ({
  connection,
  selectedTable,
  selectedColumns,
  setMessage,
}) => {
  const handleExport = async () => {
    const result = await exportTable(
      connection,
      selectedTable,
      selectedColumns
    );
    setMessage(result);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Export to CSV
    </button>
  );
};

export default ExportButton;
