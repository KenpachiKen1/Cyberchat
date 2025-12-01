import { useState }from 'react'
import React from "react";

import '../Components/chat.css'
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import copy from 'copy-to-clipboard';

import { Input, Card, Form, Button, notification} from 'antd';
const { TextArea } = Input;
const Context = React.createContext({ name: 'Default' });

import { createStyles } from 'antd-style';
import Fade from '@mui/material/Fade';

import { message } from 'antd'
import { MessageType } from 'antd/lib/message/interface';

import LoadingBar from './LoadingBar';

const useStyles = createStyles(({ token }) => ({
    root: {
      backgroundColor: 'blue',
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadius,
    },
  }));
  

const items = [
   {
     label: "Executive Email",
     key: 'executive_email',
   },
   {
     label: "Incident Report",
     key: 'incident_report',
   },
   {
     label: 'Blog Post',
     key: 'blog_post',
   },
 ];



const functionStyle = info => {
    const {props} = info;
    const clicked = props.trigger?.includes('click')
    if (clicked){
        return {
            root: {
                borderColor: 'blue',
                borderRadius: '8px'
            },
        };
    };

    return {};
}
const Chatbot = () => {

const {styles} = useStyles();
   const [responseType, setResponseType] = useState(null);
   const [incident, setIncident] = useState("");
   const [error, setError] = useState(null);
   const [agentResponse, setAgentResponse] = useState(null)
   const [label, setLabel] = useState(null);
   const [loading, setLoading] = useState(false);
   const [progress, setProgress] = useState(0);

   const [msg, context] = message.useMessage();


 const [api, contextHolder] = notification.useNotification();

 
  const openNotification = (placement) => {
    api.info({
      title: `Success!`,
      description: "Copied to Clipboard!",
      placement,
    });
  };


   const handle_message = (message) =>{
       setIncident(message);
   }


   const handle_response_type = (key) =>{
       const item = items.find(i => i.key === key);
       setLabel(item?.label || key)
       setResponseType(key)
   }

   const handle_copy = (agentText) =>{
        copy(agentText);
   }

   async function run_agent (){
       try{


        setLoading(true)
        setProgress(0
        )

        const show_progress = setInterval(() => {
            setProgress(p => {
                if (p >= 95) {
                    return 95;
                }
                    
                return p + 5
            })
        }, 100)
           const response = await fetch(`http://127.0.0.1:5000/cyber-chat`,{
               method: 'POST',
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify({Incident: incident, Response: responseType})


           })

        
           const data = await response.json();
           clearInterval(show_progress)
           setProgress(100)

           console.log(data)
           setAgentResponse(data[responseType])

           setTimeout(() => {
            setLoading(false);
            setProgress(0);
            setIncident(" ")

           }, 200);

        


       }catch(err){
           setError(err);
           console.log(err)
       }
   }






   return (
       <>

       {contextHolder}

    <div style={{display: 'flex'}}>
        <Card style={{maxWidth: '600px', marginRight: ' 5px', maxHeight: '775px'}}>
            <h2>Fill in details about your cyber incident or upload your own details</h2>
            <Form name='basic' labelCol={{span: 8}} wrapperCol={{span: 15}} style={{maxWidth: '600px'}} autoComplete='off'>
                <Form.Item label="Incident Details" name="Incident" rules={[{required: true, message: 'Incident details are required'}]}>
                    <TextArea autoSize onChange={(e) => handle_message(e.target.value)}/>
                </Form.Item>

                <br/>

                <Dropdown menu={{items, selectable: true, onClick: (e) => handle_response_type(e.key)}} trigger={['click']} styles={functionStyle}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>

                            { label ? <p>{label}</p>
                            
                            : "Choose a response type"}
                        <DownOutlined />


                        </Space>
                    </a>
            </Dropdown>



            <br/>
                <Button style={{color: 'white', backgroundColor: 'green', margin: '5px', marginTop: '10px'}} onClick={() => run_agent()}>Submit</Button>
                <LoadingBar progress={progress} loading={loading} />
            </Form>
        </Card>

        <br/>

        {
            agentResponse ? 
            <>
            <Fade in={true}>
                <Card title="Agent Response" className="Card" style={{maxWidth: '600px', cursor: 'pointer', maxHeight: '2000px'}} onClick={() => {handle_copy(agentResponse), openNotification("topRight")}} hoverable>
                    <h4 style={{color: 'black'}}>{agentResponse}</h4>
                </Card>
            </Fade>
            </>
         : ""}


        
         { error ? <h2 style={{color: 'red'}}>{error}</h2> : ""}
         </div>
       </>
       
   )
  
}




export default Chatbot;