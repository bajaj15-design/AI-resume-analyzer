import React from 'react'
import Navbar from "~/components/Navbar";
import {useState} from "react";

const upload = () => {
    const [isProcessing , setIsProcessing]= useState(false);
    const [statusText ,setStatusText] = useState('');
  return (
     <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
          <Navbar />
<section className="main-section">
    <div className="page-heading">
        <h1>Smart feedback for your dream job </h1>
        {isProcessing ? (
            <>
            <h2>{statusText}</h2>
            <img src='/images/resume-scan.gif' className="w-full"/>
            </>
        ):( 
            <h2>Drop your Resume for an ATS scrore and improvement tips</h2>
        )}
        {!isProcessing}

    </div>
</section>




          </main>
  
)};

export default upload;