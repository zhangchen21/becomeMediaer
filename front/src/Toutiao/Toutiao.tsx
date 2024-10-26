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
import axios from 'axios';

type productsData = {
  [key: string]: string[]
}

type redenvelopeData = {
  [key: string]: string
}

const { TextArea } = Input;
const name = "今日头条";

function Toutiao() {
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
        title: "处理标题",
        // action: page === "/goods" ? handleGoods : handleRedenvelope
      },
  ]

  return (
  <div className="Toutiao">
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
            // setCurrentstep(1);
          }}
        />
        {
          steps.map(step => 
            <Button 
              className="actionBtn" 
              loading={currentstep !== 0 && currentstep !== 1 && currentstep !== 4}
              icon={currentstep == 4 && <CheckOutlined />}
              type="primary" 
              onClick={() => copyToClipboard(question.replaceAll("\"", ""))} 
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
          <Redenvelope className="productsArea"/>
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

export default Toutiao;

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('无法复制文本到剪贴板：', err);
    }
  } else {
    console.error('复制功能不受支持');
  }
}
