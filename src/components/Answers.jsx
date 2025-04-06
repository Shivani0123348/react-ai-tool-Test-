import { useEffect,useState } from "react";
import { replaceHeadingStars, checkHeading } from "../helper";


const Answer=({ans,totalResult,index})=>{
   console.log(index);
   
    const [heading,setheading]=useState(false)
    const [answer,setAnswer]=useState(ans);
    useEffect(()=>{
        
    if(checkHeading(ans)){
       setheading(true) 
       setAnswer(replaceHeadingStars(ans))
    }
     
    },[])

    

    return(
        <>

        {
            index==0&&totalResult>1?<span className="pt-2 text-xl block text-white">{answer}</span>:
            heading?<span className={"pt-2 text-lg block text-white"} >{answer}</span>: 
            <span className="pl-5">{answer}</span>
        }
    
     
        </>
    )
}

export default Answer;