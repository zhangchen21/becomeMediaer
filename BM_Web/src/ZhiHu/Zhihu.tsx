import { useState, useEffect } from "react";
import { getDataFromGpt, searchArrayInString } from "../Shared";
import ZhihuScript from "./Scripts";
import { Button, Steps, Input  } from 'antd';
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import ImageContainer from "../Components/ImageContainer";
import RecommandGoods from "../Components/RecommandGoods";
import './Zhihu.scss';

type ZhihuData = {
  [key: string]: string[]
}

const { TextArea } = Input;
const name = "知乎";

function Zhihu() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [products, setProducts] = useState<string[]>([]);

  const [currentstep, setCurrentstep] = useState<number>(0);
  const [status, setStatus] = useState<any>("In Process");

  const [zhihuData, setZhihuData] = useState<ZhihuData>({});

  const steps =  [
      {
        title: "获取回答",
        action: async () => {
          // Get best type from gpt
          setCurrentstep(2);
          const typesArray = Object.keys(zhihuData);
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
          console.log(type)
          const products = zhihuData[type];
          setProducts(products);

          // Get answer text from gpt
          setCurrentstep(3);
          const Question = ZhihuScript.chatQuestion(products, question, type);
          console.log(Question)
          // const answer = await getDataFromGpt(Question, 2048, 0.4);
          const answer = "";

          setAnswer(Question.trim());
          setCurrentstep(4);
        }
      },
  ]

  // console.log(products);

  useEffect(() => {
    fetch("/src/ZhiHu/products.json")
      .then((response) => response.json())
      .then((data) => {console.log(data);setZhihuData(data)});
  }, []);

  return (
    <div className="Zhihu">
      <div className="container">
        <div className="question" key={name}>
          <h2>{name}</h2>
          <div className="actionArea">
            <TextArea 
              className="questionArea" 
              placeholder="Question"
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
                current={currentstep}
                status={currentstep === 4 ? "finish" : status}
                size="default"
                items={
                  ['输入问题', '寻找类型', '获取回答'].map((title, index) => (
                    {
                      title,
                      icon: currentstep === (index + 1) && <LoadingOutlined />,                          
                    }
                  ))
                }
              />
          </div>
          {/* <ImageContainer product={searchArrayInString(products, answer).join(", ")}/> */}
        </div> 

        <div className="result">
          <RecommandGoods 
            products={searchArrayInString(products, answer)} 
            className="productsArea"
          />          
          <TextArea
            value={answer}
            className="textarea"
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            onBlur={(e) => {
              setAnswer(e.target.value);
            }}
            placeholder="Answer"
            autoSize={{ minRows: 10, maxRows: 20 }}
          />        
        </div>                     
      </div>
    </div>
  )
}

export default Zhihu;
