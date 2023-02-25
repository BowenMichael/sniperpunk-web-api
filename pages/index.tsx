import {useEffect} from "react";
import Router from "next/router";


export  const Home = () => {
   useEffect(()=>{
       Router.push('/apiUtil').then((res)=>{
           if(res){
               console.log('Redirect Successful')
           }else{
               console.log('Redirect Failed')
           }
       });
   })
    
    return (<>
    
    </>)
}


export default Home;