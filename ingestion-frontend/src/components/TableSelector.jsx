import { getColumns } from "../api.js";

const TableSelector = ({
  tables,
  selectedTable,
  setSelectedTable,
  connection,
  setColumns,
  setSelectedColumns,
}) => {
  const fetchColumns = async () => {
    const result = await getColumns(connection, selectedTable);
    setColumns(result);
    setSelectedColumns(result);
  };

  return (
    <div className="mt-4">
      <label className="block mb-2 font-medium">Select Table:</label>
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">-- Select --</option>
        {tables.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button
        onClick={fetchColumns}
        className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
      >
        Get Columns
      </button>
    </div>
  );
};

export default TableSelector;
