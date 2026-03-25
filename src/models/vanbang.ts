import { useState, useEffect } from "react";

export interface VanBang {
  id: number;
  tenSinhVien: string;
  year: number;
  soVaoSo: number;
  soHieu: string;
}

export default function useVanBangModel() {
  const [list, setList] = useState<VanBang[]>([]);

  // load từ localStorage
  useEffect(() => {
    const data = localStorage.getItem("vanbang");
    if (data) {
      setList(JSON.parse(data));
    }
  }, []);

  // lưu lại
  useEffect(() => {
    localStorage.setItem("vanbang", JSON.stringify(list));
  }, [list]);

  const addVanBang = (tenSinhVien: string) => {
    const currentYear = new Date().getFullYear();

    // lọc theo năm hiện tại
    const currentList = list.filter((item) => item.year === currentYear);

    const soVaoSo = currentList.length + 1;

    const newVanBang: VanBang = {
      id: Date.now(),
      tenSinhVien,
      year: currentYear,
      soVaoSo,
      soHieu: `VB-${currentYear}-${soVaoSo}`,
    };

    setList([...list, newVanBang]);
  };

  return {
    list,
    addVanBang,
  };
}