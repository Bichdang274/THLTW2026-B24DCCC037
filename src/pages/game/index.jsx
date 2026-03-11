import { useState } from 'react';
import { Card, Button, List } from 'antd';

const options = ['Kéo', 'Búa', 'Bao'];

export default function Game() {

  const [history, setHistory] = useState([]);

  const getResult = (player, computer) => {
    if (player === computer) return 'Hòa';

    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }

    return 'Thua';
  };

  const play = (choice) => {

    const computerChoice =
      options[Math.floor(Math.random() * 3)];

    const result = getResult(choice, computerChoice);

    const newRound = {
      player: choice,
      computer: computerChoice,
      result
    };

    setHistory([newRound, ...history]);
  };

  return (
    <Card title="Game Oẳn Tù Tì">

      <Button onClick={() => play('Kéo')}>Kéo</Button>
      <Button onClick={() => play('Búa')} style={{marginLeft:10}}>Búa</Button>
      <Button onClick={() => play('Bao')} style={{marginLeft:10}}>Bao</Button>

      <List
        header="Lịch sử ván đấu"
        dataSource={history}
        renderItem={(item,index)=>(
          <List.Item>
            Ván {index+1} :
            Bạn {item.player} - Máy {item.computer}
            → {item.result}
          </List.Item>
        )}
      />

    </Card>
  );
}
