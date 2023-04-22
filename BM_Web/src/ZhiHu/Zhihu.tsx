import { useState, useEffect } from "react";
import { getDataFromGpt, searchArrayInString } from "../Shared";
import ZhihuScript from "./Scripts";
import { Button, Steps, Input  } from 'antd';
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import ImageContainer from "../Components/ImageContainer";
import Navbar from "../Components/Nav";
import './Zhihu.scss';

type ZhihuData = {
  [key: string]: string[]
}

const { TextArea } = Input;

function Zhihu() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  const [currentstep, setCurrentstep] = useState<number>(0);
  const [status, setStatus] = useState<any>("In Process");

  const [zhihuData, setZhihuData] = useState<ZhihuData>({});
  const [products, setProducts] = useState<string[]>([]);

  const Actions = [{
    name: "知乎",
    steps: [
      {
        title: "获取回答",
        action: async () => {
          // Get best type from gpt
          setCurrentstep(1);
          const typesArray = Object.keys(zhihuData);
          const getTypeQuestion = ZhihuScript.chatType(question, typesArray);
          const typeAnswer = await getDataFromGpt(getTypeQuestion, 16, 0);

          setCurrentstep(2);
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
          const Question = ZhihuScript.chatQuestion(products, question, type);
          console.log(Question)
          const answer = `
          我刚刚吃到了这辈子最好吃的糖果！好吃到差点哭出来，热泪盈眶！！今天整理了几款平价零食饮料合集，都蛮适合打工人早上吃的。在这里，我想向大家推荐的是知乎知物的浮力袋泡冷萃咖啡（送梅森杯），坚果可可 1 盒+樱桃黑巧 1 盒。

首先，这款浮力袋泡冷萃咖啡（送梅森杯）非常适合上班族早上快速享受一杯咖啡的味道。这款咖啡是通过冷萃技术精制而成，不含糖和乳制品，同时也不含任何防腐剂，非常健康。这种泡咖啡的方式，使得咖啡的味道更加醇厚，口感更佳。

其次，搭配坚果可可和樱桃黑巧，早餐就变得更加美味。坚果可可是一种健康的零食，不仅可以增加能量，还可以帮助控制食欲，同时也非常便宜。而樱桃黑巧则是一种高级巧克力，樱桃和黑巧克力的混合让这款零食既酸又甜，令人难以抗拒。

总之，这些零食饮料都非常实惠，适合打工人的口味和预算。如果你是一个忙碌的上班族，每天都需要快速的早餐，这款浮力袋泡冷萃咖啡（送梅森杯），坚果可可 1 盒+樱桃黑巧 1 盒的组合非常值得尝试。`;
          // const answer = await getDataFromGpt(Question, 512, 0.4);

          setCurrentstep(3);
          setAnswer(answer);
          console.log(products)
          setCurrentstep(4);
        }
      },
    ]
  },]
  console.log(products)
  useEffect(() => {
    fetch("/src/ZhiHu/products.json")
      .then((response) => response.json())
      .then((data) => {console.log(data);setZhihuData(data)});
  }, []);

  return (
    <div className="Zhihu">
      <div className="container">
        {
          Actions.map(action => 
            <div className="section" key={action.name}>
              <h2>{action.name}</h2>
              <div className="actionArea">
                <TextArea 
                  className="questionArea" 
                  placeholder="Question"
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  value={question}  
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {
                  action.steps.map(step => 
                    <Button 
                      className="actionBtn" 
                      loading={currentstep !== 0 && currentstep !== 4}
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
                    size="small"
                    items={
                      ['Enter question', 'Get type', 'Get answer'].map((title, index) => (
                        {
                          title,
                          icon: currentstep === (index + 1) && <LoadingOutlined />,                          
                        }
                      ))
                    }
                  />
              </div>
              <ImageContainer product={searchArrayInString(products, answer).join(", ")}/>
            </div>              
          )
        }
      </div>
      <div>
        <TextArea
          value={searchArrayInString(products, answer).join(", ")}
          className="textarea"
          placeholder="Products"
          autoSize={{ minRows: 1, maxRows: 2 }}
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
          autoSize={{ minRows: 10, maxRows: 40 }}
        />        
      </div>

    </div>
  )
}

export default Zhihu;
