import { useState } from "react";
import type { FormEvent } from "react";;
import FileUploader from "~/Components/FileUploader";
import {Navbar} from "../Components/Navbar";

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setIsProcessing(true);
  setStatusText("Uploading your resume...");

  setTimeout(() => {
    setStatusText("Analyzing Resume...");
  }, 2000);
};

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading mt-6 py-12">
          <h1>Smart Feedback for Your <br></br>Dream Job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>

              <img
                src="/images/resume-scan.gif"
                alt="Scanning Resume"
                className="w-full max-w-md mx-auto mt-6"
              />
            </>
          ) : (
            <>
              <h2>
                Drop your Resume for an ATS score and improvement tips
              </h2>

              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-8 max-w-xl mx-auto"
              >
                <div className="form-div">
                  <label htmlFor="company-name">Company Name</label>

                  <input
                    type="text"
                    id="company-name"
                    name="company-name"
                    placeholder="Company Name"
                    className="w-full"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-title">Job Title</label>

                  <input
                    type="text"
                    id="job-title"
                    name="job-title"
                    placeholder="Frontend Developer"
                    className="w-full"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-description">Job Description</label>

                  <textarea rows={5}
                    id="job-description"
                    name="job-description"
                    placeholder="Job Description"
                    className="w-full"
                    required
                  />
                </div>

                 <div className="form-div">
                  <label htmlFor="uploader"> Upload Resume</label>
                  <FileUploader onFileSelect={handleFileSelect}/>

                 
                  </div>
    

                  <button className="primary-button" type="submit">
                    Analyze Resume
                    </button>

              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;