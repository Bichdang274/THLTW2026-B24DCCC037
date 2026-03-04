import { useState } from 'react';
import { Button, Input, Card } from 'antd';

const Bai1 = () => {
  const [randomNumber] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState<number>();
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>(
    'Bạn có 10 lượt để đoán số từ 1 đến 100'
  );

  const maxAttempts = 10;

  const checkGuess = () => {
    if (attempts >= maxAttempts) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guess! < randomNumber) {
      setMessage('Bạn đoán quá thấp!');
    } else if (guess! > randomNumber) {
      setMessage('Bạn đoán quá cao!');
    } else {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      return;
    }

    if (newAttempts === maxAttempts) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}`);
    }
  };

  return (
    <Card title="Bài 1 - Game Đoán Số">
      <p>{message}</p>

      <Input
        type="number"
        placeholder="Nhập số"
        onChange={(e) => setGuess(Number(e.target.value))}
        style={{ width: 200, marginRight: 10 }}
      />

      <Button type="primary" onClick={checkGuess}>
        Đoán
      </Button>

      <p>Số lượt đã dùng: {attempts}/10</p>
    </Card>
  );
};

export default Bai1;