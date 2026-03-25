import React, { useState, useEffect } from "react";

interface VanBang {
  id: number;
  tenSinhVien: string;
  year: number;
  soVaoSo: number;
  soHieu: string;
}

const VanBangPage: React.FC = () => {
  const [list, setList] = useState<VanBang[]>([]);
  const [name, setName] = useState("");

  // load dữ liệu
  useEffect(() => {
    const data = localStorage.getItem("vanbang");
    if (data) {
      setList(JSON.parse(data));
    }
  }, []);

  // lưu dữ liệu
  useEffect(() => {
    localStorage.setItem("vanbang", JSON.stringify(list));
  }, [list]);

  const addVanBang = () => {
    if (!name.trim()) return;

    const year = new Date().getFullYear();

    // lọc theo năm → reset số
    const current = list.filter((i) => i.year === year);

    const newItem: VanBang = {
      id: Date.now(),
      tenSinhVien: name,
      year,
      soVaoSo: current.length + 1,
      soHieu: `VB-${year}-${current.length + 1}`,
    };

    setList([...list, newItem]);
    setName("");
  };

  const year = new Date().getFullYear();
  const data = list.filter((i) => i.year === year);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sổ văn bằng năm {year}</h2>

      <input
        value={name}
        placeholder="Tên sinh viên"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addVanBang}>Cấp văn bằng</button>

      <table style={{ marginTop: 20, border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>Số vào sổ</th>
            <th style={{ border: "1px solid black" }}>Số hiệu</th>
            <th style={{ border: "1px solid black" }}>Tên</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i.id}>
              <td style={{ border: "1px solid black" }}>{i.soVaoSo}</td>
              <td style={{ border: "1px solid black" }}>{i.soHieu}</td>
              <td style={{ border: "1px solid black" }}>{i.tenSinhVien}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VanBangPage;