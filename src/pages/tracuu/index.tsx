import  { useState, useEffect } from "react";

export default function TraCuu() {
  const [list, setList] = useState<any[]>([]);
  const [result, setResult] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const data = localStorage.getItem("vanbang");
    if (data) setList(JSON.parse(data));
  }, []);

  const search = () => {
    // bắt buộc ít nhất 2 điều kiện
    const filled = Object.values(form).filter(Boolean);
    if (filled.length < 2) {
      alert("Nhập ít nhất 2 điều kiện");
      return;
    }

    const res = list.filter((i) => {
      return (
        (!form.soHieu || i.soHieu.includes(form.soHieu)) &&
        (!form.hoTen || i.hoTen.includes(form.hoTen))
      );
    });

    setResult(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tra cứu văn bằng</h2>

      <input placeholder="Số hiệu" onChange={(e) => setForm({...form, soHieu: e.target.value})}/>
      <input placeholder="Họ tên" onChange={(e) => setForm({...form, hoTen: e.target.value})}/>

      <button onClick={search}>Tìm</button>

      <hr/>

      {result.map((i) => (
        <div key={i.id}>
          {i.soHieu} - {i.hoTen}
        </div>
      ))}
    </div>
  );
}