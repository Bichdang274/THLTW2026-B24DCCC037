import React, { useState, useEffect } from "react";

interface QuyetDinh {
  id: number;
  soQD: string;
  ngayBanHanh: string;
  trichYeu: string;
  nam: number;
}

const QuyetDinhPage: React.FC = () => {
  const [list, setList] = useState<QuyetDinh[]>([]);
  const [soQD, setSoQD] = useState("");
  const [ngay, setNgay] = useState("");
  const [trichYeu, setTrichYeu] = useState("");

  // load
  useEffect(() => {
    const data = localStorage.getItem("quyetdinh");
    if (data) setList(JSON.parse(data));
  }, []);

  // save
  useEffect(() => {
    localStorage.setItem("quyetdinh", JSON.stringify(list));
  }, [list]);

  const addQD = () => {
    if (!soQD || !ngay) return;

    const year = new Date().getFullYear();

    const newQD: QuyetDinh = {
      id: Date.now(),
      soQD,
      ngayBanHanh: ngay,
      trichYeu,
      nam: year,
    };

    setList([...list, newQD]);

    // reset form
    setSoQD("");
    setNgay("");
    setTrichYeu("");
  };

  const year = new Date().getFullYear();
  const data = list.filter((i) => i.nam === year);

  return (
    <div style={{ padding: 20 }}>
      <h2>Quyết định tốt nghiệp năm {year}</h2>

      <div>
        <input
          placeholder="Số quyết định"
          value={soQD}
          onChange={(e) => setSoQD(e.target.value)}
        />
        <input
          type="date"
          value={ngay}
          onChange={(e) => setNgay(e.target.value)}
        />
        <input
          placeholder="Trích yếu"
          value={trichYeu}
          onChange={(e) => setTrichYeu(e.target.value)}
        />
        <button onClick={addQD}>Thêm quyết định</button>
      </div>

      <table style={{ marginTop: 20, border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>Số QĐ</th>
            <th style={{ border: "1px solid black" }}>Ngày</th>
            <th style={{ border: "1px solid black" }}>Trích yếu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i.id}>
              <td style={{ border: "1px solid black" }}>{i.soQD}</td>
              <td style={{ border: "1px solid black" }}>{i.ngayBanHanh}</td>
              <td style={{ border: "1px solid black" }}>{i.trichYeu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuyetDinhPage;