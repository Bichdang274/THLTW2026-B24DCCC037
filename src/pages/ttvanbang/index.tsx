import { useState, useEffect } from "react";

interface VanBang {
  id: number;
  soVaoSo: number;
  soHieu: string;
  hoTen: string;
  ngaySinh: string;
  nam: number;
  quyetDinhId: number;
  extra: Record<string, any>;
}

export default function VanBangPage() {
  const [list, setList] = useState<VanBang[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const vb = localStorage.getItem("ttvanbang");
    const f = localStorage.getItem("fields");

    if (vb) setList(JSON.parse(vb));
    if (f) setFields(JSON.parse(f));
  }, []);

  useEffect(() => {
    localStorage.setItem("ttvanbang", JSON.stringify(list));
  }, [list]);

  const add = () => {
    const year = new Date().getFullYear();
    const current = list.filter((i) => i.nam === year);

    const newItem: VanBang = {
      id: Date.now(),
      soVaoSo: current.length + 1, // auto tăng
      soHieu: form.soHieu,
      hoTen: form.hoTen,
      ngaySinh: form.ngaySinh,
      nam: year,
      quyetDinhId: 1, // demo
      extra: form.extra || {},
    };

    setList([...list, newItem]);
  };

  const year = new Date().getFullYear();
  const data = list.filter((i) => i.nam === year);

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý văn bằng</h2>

      <input placeholder="Số hiệu" onChange={(e) => setForm({...form, soHieu: e.target.value})}/>
      <input placeholder="Họ tên" onChange={(e) => setForm({...form, hoTen: e.target.value})}/>
      <input type="date" onChange={(e) => setForm({...form, ngaySinh: e.target.value})}/>

      {/* field động */}
      {fields.map((f) => (
        <div key={f.id}>
          <label>{f.name}</label>

          {f.type === "string" && (
            <input onChange={(e) => setForm({
              ...form,
              extra: {...form.extra, [f.name]: e.target.value}
            })}/>
          )}

          {f.type === "number" && (
            <input type="number" onChange={(e) => setForm({
              ...form,
              extra: {...form.extra, [f.name]: e.target.value}
            })}/>
          )}

          {f.type === "date" && (
            <input type="date" onChange={(e) => setForm({
              ...form,
              extra: {...form.extra, [f.name]: e.target.value}
            })}/>
          )}
        </div>
      ))}

      <button onClick={add}>Cấp văn bằng</button>

      <hr/>

      {data.map((i) => (
        <div key={i.id}>
          {i.soVaoSo} - {i.soHieu} - {i.hoTen}
        </div>
      ))}
    </div>
  );
}