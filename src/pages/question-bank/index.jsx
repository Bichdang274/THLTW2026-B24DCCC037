import { useState } from 'react';
import { Card, Button, Input, Select, Table } from 'antd';

export default function QuestionBank(){

  const [subjects,setSubjects] = useState([]);
  const [blocks,setBlocks] = useState([]);
  const [questions,setQuestions] = useState([]);
  const [exam,setExam] = useState([]);

  const [name,setName] = useState('');
  const [subject,setSubject] = useState('');
  const [content,setContent] = useState('');
  const [level,setLevel] = useState('');

  // thêm khối kiến thức
  const addBlock = ()=>{
    setBlocks([...blocks,{name}]);
    setName('');
  }

  // thêm môn học
  const addSubject = ()=>{
    setSubjects([...subjects,{name}]);
    setName('');
  }

  // thêm câu hỏi
  const addQuestion = ()=>{

    const newQ = {
      id: questions.length + 1,
      subject,
      content,
      level
    }

    setQuestions([...questions,newQ]);
  }

  // tạo đề thi
  const createExam = ()=>{

    const easy = questions.filter(q=>q.level==='Dễ').slice(0,1);
    const medium = questions.filter(q=>q.level==='Trung bình').slice(0,1);
    const hard = questions.filter(q=>q.level==='Khó').slice(0,1);

    if(easy.length===0 || medium.length===0 || hard.length===0){
      alert("Không đủ câu hỏi");
      return;
    }

    const newExam = [...easy,...medium,...hard];

    setExam(newExam);
  }

  return(

    <div>

      <Card title="Thêm khối kiến thức">
        <Input
          placeholder="Tên khối"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <Button onClick={addBlock}>Thêm</Button>
      </Card>


      <Card title="Thêm môn học">
        <Input
          placeholder="Tên môn"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <Button onClick={addSubject}>Thêm</Button>
      </Card>


      <Card title="Thêm câu hỏi">

        <Input
          placeholder="Nội dung câu hỏi"
          onChange={e=>setContent(e.target.value)}
        />

        <Select
          style={{width:200}}
          placeholder="Chọn môn"
          onChange={setSubject}
        >
          {subjects.map((s,i)=>(
            <Select.Option key={i} value={s.name}>
              {s.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          style={{width:200}}
          placeholder="Độ khó"
          onChange={setLevel}
        >
          <Select.Option value="Dễ">Dễ</Select.Option>
          <Select.Option value="Trung bình">Trung bình</Select.Option>
          <Select.Option value="Khó">Khó</Select.Option>
        </Select>

        <Button onClick={addQuestion}>Thêm câu hỏi</Button>

      </Card>


      <Card title="Danh sách câu hỏi">

        <Table
          dataSource={questions}
          columns={[
            {title:'ID',dataIndex:'id'},
            {title:'Môn',dataIndex:'subject'},
            {title:'Nội dung',dataIndex:'content'},
            {title:'Độ khó',dataIndex:'level'},
          ]}
        />

      </Card>


      <Card title="Tạo đề thi">

        <Button type="primary" onClick={createExam}>
          Tạo đề
        </Button>

        <Table
          dataSource={exam}
          columns={[
            {title:'ID',dataIndex:'id'},
            {title:'Nội dung',dataIndex:'content'},
            {title:'Độ khó',dataIndex:'level'},
          ]}
        />

      </Card>

    </div>
  );
}
