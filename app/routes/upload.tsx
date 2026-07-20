import { useState } from "react";
import type { FormEvent } from "react";
import FileUploader from "~/Components/FileUploader";
import { Navbar } from "../Components/Navbar";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdfToimage";

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");

    const uploadFile = await fs.upload([file]);

    if (!uploadFile || uploadFile.length === 0) {
      setStatusText("File upload failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    setStatusText("Converting to image...");

    const imageFile = await convertPdfToImage(file);

    if (!imageFile?.file) {
      setStatusText("Failed to convert PDF to image.");
      setIsProcessing(false);
      return;
    }

    setStatusText("Uploading image...");

    const uploadImage = await fs.upload([imageFile.file]);

    if (!uploadImage || uploadImage.length === 0) {
      setStatusText("Error uploading image.");
      setIsProcessing(false);
      return;
    }

    setStatusText("Preparing data...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadFile[0].path,
      imagePath: uploadImage[0].path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: null as any,
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing the resume...");

    const feedback = await ai.feedback(
      uploadFile[0].path,
      prepareInstructions({
        companyName,
        jobTitle,
        jobDescription,
      })
    );

    if (!feedback) {
      setStatusText("Error analyzing resume.");
      setIsProcessing(false);
      return;
    }

   const feedbackText =
  typeof feedback.message.content === "string"
    ? feedback.message.content
    : feedback.message.content[0]?.text || "";

try {
  data.feedback = JSON.parse(feedbackText);
} catch (error) {
  console.log("JSON Parse Error", error);
  setStatusText("AI response invalid");
  setIsProcessing(false);
  return;
}

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analysis complete. Redirecting...");

    console.log(data);

    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    await handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading mt-6 py-12">
          <h1>
            Smart Feedback for Your <br />
            Dream Job
          </h1>

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
                  <label htmlFor="company-name">
                    Company Name
                  </label>

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
                  <label htmlFor="job-title">
                    Job Title
                  </label>

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
                  <label htmlFor="job-description">
                    Job Description
                  </label>

                  <textarea
                    rows={5}
                    id="job-description"
                    name="job-description"
                    placeholder="Job Description"
                    className="w-full"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="uploader">
                    Upload Resume
                  </label>

                  <FileUploader
                    onFileSelect={handleFileSelect}
                  />
                </div>

                <button
                  className="primary-button"
                  type="submit"
                >
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