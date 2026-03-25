import React, { useState, useEffect } from "react";

interface Field {
  id: number;
  name: string;
  type: "string" | "number" | "date";
}

const FieldPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<Field["type"]>("string");

  useEffect(() => {
    const data = localStorage.getItem("fields");
    if (data) setFields(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("fields", JSON.stringify(fields));
  }, [fields]);

  const addField = () => {
    if (!name.trim()) return;

    const newField: Field = {
      id: Date.now(),
      name,
      type,
    };

    setFields([...fields, newField]);
    setName("");
  };

  const deleteField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cấu hình phụ lục văn bằng</h2>

      <input
        placeholder="Tên trường"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
      </select>

      <button onClick={addField}>Thêm</button>

      <table style={{ marginTop: 20, border: "1px solid black" }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Kiểu</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.type}</td>
              <td>
                <button onClick={() => deleteField(f.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FieldPage;