import { ingestCSV } from "../api.js";

const CSVUploader = ({ connection, selectedTable, setMessage }) => {
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tableName", selectedTable);
    formData.append("host", connection.host);
    formData.append("port", connection.port);
    formData.append("database", connection.database);
    formData.append("username", connection.username);
    formData.append("jwtToken", connection.jwtToken);

    const result = await ingestCSV(formData);
    setMessage(result);
  };

  return (
    <label className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">
      Upload CSV
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCSVUpload}
      />
    </label>
  );
};

export default CSVUploader;
