import { useEffect, useState, useRef} from 'react'

import './App.css'
import {URL} from "./constants"
import Answer from './components/Answers';
function App() {
  const [question,setquestion]=useState('');
  const [result,setResult]=useState([])
  const [recentHistory,setrecentHistory]=useState([JSON.parse(localStorage.getItem('history'))]);
  const [SelectedHistory,setSelectedHistory]=useState('')
  const scrollToAns=useRef();
  const askQuestion= async()=>{

    if(!question && !SelectedHistory) {
      return false;
    }

    if(question)
    {

      if(localStorage.getItem('history')){
        let history=JSON.parse(localStorage.getItem('history'))
        history=[question, ...history]
        localStorage.setItem('history',JSON.stringify(history))
        setrecentHistory(history)
      }
  
      else {
        localStorage.setItem('history',JSON.stringify([question]))
        setrecentHistory([question])
      }

    }

    const payloadData=question?question:SelectedHistory

    const  payload= {
      "contents":[{
        "parts":[{"text":payloadData}]
      }]
     }
    
   let response= await fetch(URL,{
     method:"POST",
     body:JSON.stringify(payload)
   })

   response= await response.json();
  
   let dataString=response.candidates[0].content.parts[0].text;
   dataString=dataString.split("* ");
   dataString=dataString.map((item)=>item.trim())
   
   console.log(dataString);
   setResult([...result,{type:'q',text:question?question:SelectedHistory},{type:'a',text:dataString}]);
   setquestion('')
   
   setTimeout(()=>{
    scrollToAns.current.scrollTop=scrollToAns.current.scrollHeight

   },500)
  }

  const clearHistory=()=>{
    localStorage.clear();
    setrecentHistory([])
  }

  const isEnter=(event)=>{
     if(event.key=='Enter'){
      askQuestion()

     }

     
  }

  useEffect(()=>{
    askQuestion()
  },[SelectedHistory])
  return (
 <div className='grid grid-cols-5'>
  <div className='col-span-1 bg-zinc-800 h-screen'>
    <h1 className='text-xl text-white pt-3 flex justify-center'>
      <span>Recent Search </span>
      <button onClick={clearHistory} className='cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button></h1>
   <ul className='text-left overflow-auto  m-5 mt-2'>
    {
       recentHistory && recentHistory.map((item,index)=>(

        < li onClick={()=>setSelectedHistory(item)} className='p-1 pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200'>{item}</li>

       ))
      }
    </ul> 
  </div>
  <div className='col-span-4 p-10'>
    <h1 className='text-4xl pb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700'
    >
      Hello User Ask me Anything</h1>
    <div className='container h-150 overflow-y-auto scrollbar-hide h-40 ' ref={scrollToAns}>
       <div className='text-zinc-300'>
    <ul> 
    {
      result.map((item,index)=>(
          <div key={index+Math.random()}  className={item.type=='q'?'flex justify-end':''}>{

            item.type=='q'? <li key={index+Math.random()} className='text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl  rounded-bl-3xl w-fit
            '> <Answer ans={item.text} totalResult={1} index={index} /></li>
          :item.text.map((ansItem,ansIndex)=>(
<li key={ansIndex+Math.random()} className='text-left p-1 '> <Answer ans={ansItem} totalResult={item.text.length} index={ansIndex} /></li>
          ))
          
          }
          </div>
      ))
    } 

    </ul>   
      
      
      
    
  
       
       </div>
      
    </div>

    <div className='bg-zinc-800 w-1/2 mt-20 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h-16'>
      <input type="text" value={question} 
      onKeyDown={isEnter}
      onChange={(e)=>setquestion(e.target.value)}className="w-full h-full p-3 outline-none"placeholder="Ask me anything"/>
      <button onClick={askQuestion}>Ask</button>
    </div>
  </div>
 </div>
  )
}

export default App;



