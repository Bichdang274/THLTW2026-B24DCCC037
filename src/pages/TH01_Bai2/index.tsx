import React, { useState, useEffect } from 'react';
import { Card, Input, Button } from 'antd';

const Bai2 = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [studies, setStudies] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [goal, setGoal] = useState<number>(0);

  useEffect(() => {
    const s = localStorage.getItem('subjects');
    const st = localStorage.getItem('studies');
    const g = localStorage.getItem('goal');

    if (s) setSubjects(JSON.parse(s));
    else setSubjects(['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ']);

    if (st) setStudies(JSON.parse(st));
    if (g) setGoal(Number(g));
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('studies', JSON.stringify(studies));
    localStorage.setItem('goal', String(goal));
  }, [subjects, studies, goal]);

  const addSubject = () => {
    if (!newSubject) return;
    setSubjects([...subjects, newSubject]);
    setNewSubject('');
  };

  const deleteSubject = (index: number) => {
    const arr = [...subjects];
    arr.splice(index, 1);
    setSubjects(arr);
  };

  const addStudy = (subject: string) => {
    const time = prompt('Nhập ngày giờ học:');
    const duration = prompt('Nhập thời lượng (giờ):');
    const content = prompt('Nhập nội dung đã học:');
    const note = prompt('Nhập ghi chú:');

    if (!time || !duration) return;

    const newStudy = {
      subject,
      time,
      duration: Number(duration),
      content,
      note,
    };

    setStudies([...studies, newStudy]);
  };

  const deleteStudy = (index: number) => {
    const arr = [...studies];
    arr.splice(index, 1);
    setStudies(arr);
  };

  const totalHours = studies.reduce(
    (sum, s) => sum + Number(s.duration),
    0
  );

  return (
    <Card title="Bài 2 - Quản lý học tập">
      <h3>Danh mục môn học</h3>

      <Input
        placeholder="Thêm môn"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />

      <Button onClick={addSubject}>Thêm</Button>

      <ul>
        {subjects.map((s, index) => (
          <li key={index}>
            {s}{' '}
            <Button size="small" onClick={() => addStudy(s)}>
              Thêm lịch học
            </Button>{' '}
            <Button
              size="small"
              danger
              onClick={() => deleteSubject(index)}
            >
              Xóa
            </Button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Danh sách lịch học</h3>

      <ul>
        {studies.map((s, index) => (
          <li key={index}>
            {s.subject} | {s.time} | {s.duration}h | {s.content} | {s.note}{' '}
            <Button
              size="small"
              danger
              onClick={() => deleteStudy(index)}
            >
              Xóa
            </Button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Mục tiêu tháng</h3>

      <Input
        type="number"
        placeholder="Nhập số giờ mục tiêu"
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
        style={{ width: 200 }}
      />

      <p>
        Tổng giờ đã học: {totalHours} giờ <br />
        {totalHours >= goal
          ? 'Đã hoàn thành mục tiêu!'
          : 'Chưa đạt mục tiêu!'}
      </p>
    </Card>
  );
};

export default Bai2;