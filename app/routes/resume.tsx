import { Link, useParams } from "react-router";
import { useEffect } from "react";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your Resume" },
];

const Resume = () => {
    const {auth, isLoading , fs , kv} = usePuterStore(); 
const {id} = useParams();

useEffect (()=>{
  const loadresume = async () => {
    const resume = await kv.get(`resume:${id}`);
    if (!resume) return ;
    const data = JSON.parse(resume);
    const resumeBlob = await fs.read(data.resumePath)
    if (!resumeBlob) return;
  }
},)


  return (
  <main className="!pt=0">
    <nav className ="resume-nav">
        <Link to = "/" className ="back-button">
        <img src = "/images/back.svg" alt = "logo" className="w-2.5 h-2.5"/>
        <span className ="text-gray-800 text-sm font-semibold">
            Back to Homepage
        </span>
         </Link>   
     </nav>
     <div className ="flex flex-row w-full max-lg:flex-col-reverse">
        <section className ="feedback-section ">
            {imageUrl && resumeUrl && ( 
                <div  className= "animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%]
                max-wxl:h-fit w-fit">
                </div>
            )
        </section>

     </div>
  </main>
  )


export default Resume;