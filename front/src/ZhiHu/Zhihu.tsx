import { useState, useEffect } from "react";
import { getDataFromGpt, searchArrayInString } from "../Shared";
import ZhihuScript from "./Scripts";
import { Button, Steps, Input, Card  } from 'antd';
import { LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ImageContainer from "../Components/ImageContainer";
import Redenvelope from "./Components/Redenvelope";
import RecommandGoods from "../Components/RecommandGoods";
import './Zhihu.scss';
import { useLocation } from "react-router-dom";

type productsData = {
  [key: string]: string[]
}

type redenvelopeData = {
  [key: string]: string
}

const { TextArea } = Input;
const name = "知乎";

function Zhihu() {
  const location = useLocation().pathname.replace("/zhihu", "");
  const [page, setPage] = useState(location); 

  useEffect(() => {
    setPage(location);
  }, [location])

  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [products, setProducts] = useState<string[]>([]);

  const [currentstep, setCurrentstep] = useState<number>(0);
  const [status, setStatus] = useState<any>("In Process");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const [productsData, setProductsData] = useState<productsData>({});
  const [redenvelopeData, setRedenvelopeData] = useState<redenvelopeData>({});

  const steps =  [
      {
        title: "获取回答",
        action: page === "/goods" ? handleGoods : handleRedenvelope
      },
  ]

  async function handleGoods() {
    // Get best type from gpt
    setCurrentstep(2);
    const typesArray = Object.keys(productsData);
    const getTypeQuestion = ZhihuScript.chatType(question, typesArray);
    const typeAnswer = await getDataFromGpt(getTypeQuestion, 16, 0);

    const Regex = new RegExp(typesArray.join("|"));
    let type = typeAnswer.match(Regex)?.[0];
    // If get type error, try it again
    if(!type) {
      const typeAnswer = await getDataFromGpt(getTypeQuestion, 16, 0);
      type = typeAnswer.match(Regex)?.[0];
    }
    if(!type) {
      setStatus("error");
      return;
    }
    const products = productsData[type];
    setProducts(products);

    // Get answer text from gpt
    setCurrentstep(3);
    const Question = ZhihuScript.chatQuestion(products, question, type);
    console.log(Question)
    // const answer = await getDataFromGpt(Question, 2048, 0.4);
    const answer = "";

    setAnswer(Question.trim());
    setCurrentstep(4);
    setShowAnswer(true);
  }

  async function handleRedenvelope() {
    setCurrentstep(3);
    const answer = await getDataFromGpt(question, 1024, 0.2);
    setAnswer(answer.trim());
    setCurrentstep(4);
    setShowAnswer(true);
  }

  useEffect(() => {
    fetch("/src/ZhiHu/products.json")
      .then((response) => response.json())
      .then((data) => {
        setProductsData(data)}
      );

    fetch("/src/ZhiHu/redenvelope.json")
      .then((response) => response.json())
      .then((data) => {
        setRedenvelopeData(data)}
      );
  }, []);

  return (
  <div className="Zhihu">
  <div className="container">
    <div className="question" key={name}>
      <div className="title">
        {name}
      </div>
      <div className="actionArea">
        <TextArea 
          className="questionArea" 
          placeholder="请输入问题"
          autoSize={{ minRows: 1, maxRows: 1 }}
          value={question}  
          onChange={(e) => {
            setQuestion(e.target.value);
            setCurrentstep(1);
          }}
        />
        {
          steps.map(step => 
            <Button 
              className="actionBtn" 
              loading={currentstep !== 0 && currentstep !== 1 && currentstep !== 4}
              icon={currentstep == 4 && <CheckOutlined />}
              type="primary" 
              onClick={step.action} 
              key={step.title}
            >{step.title}</Button>
          )
        }
      </div>
      <div className="steps">
        <Steps
            current={currentstep - 1}
            status={currentstep === 4 ? "finish" : status}
            size="default"
            items={
              ['输入问题', '算法处理', '得到回答'].map((title, index) => (
                {
                  title,
                  icon: currentstep === (index + 1) && <LoadingOutlined />,                          
                }
              ))
            }
          />
      </div>
      {/* <ImageContainer products={searchArrayInString(products, answer)}/> */}
    </div> 

    <div className="result">
      {
        page === "/goods"
        ? (
          <RecommandGoods 
            products={searchArrayInString(products, answer)} 
            className="productsArea"
          />   
        )
        : (
          <Redenvelope questions={redenvelopeData} className="productsArea"/>
        )
      }            
    </div>       

    <Card 
      title={question} 
      extra={<CloseOutlined onClick={() => setShowAnswer(false)}/>}  
      className="answerarea"
      style={{visibility: `${showAnswer ? "visible" : "hidden"}`}}
    >
      <TextArea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          onBlur={(e) => {
            setAnswer(e.target.value);
          }}
          placeholder="Answer"
          autoSize={{ minRows: 30, maxRows: 60 }}
        />   
    </Card>
  </div>
  </div>
  )
}

export default Zhihu;
