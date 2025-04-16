const ColumnSelector = ({ columns, selectedColumns, setSelectedColumns }) => {
  return (
    <div className="mt-6">
      <label className="block mb-2 font-medium">
        Select Columns to Export:
      </label>
      <div className="grid grid-cols-2 gap-2">
        {columns.map((col) => (
          <label key={col} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedColumns.includes(col)}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedColumns((prev) =>
                  checked ? [...prev, col] : prev.filter((c) => c !== col)
                );
              }}
            />
            <span>{col}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
