import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

import Details from "~/Components/Details";
import Summary from "~/Components/Summary";
import ATS from "~/Components/ATS";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your Resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();

  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);


  useEffect(() => {
    let currentResumeUrl = "";
    let currentImageUrl = "";

    const loadResume = async () => {
      if (!id) return;

      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);
      console.log("RESUME DATA:", data);


      const resumeBlob = await fs.read(data.resumePath);

      if (!resumeBlob) return;


      currentResumeUrl = URL.createObjectURL(
        new Blob([resumeBlob], {
          type: "application/pdf",
        })
      );

      setResumeUrl(currentResumeUrl);


      const imageBlob = await fs.read(data.imagePath);

      if (!imageBlob) return;


      currentImageUrl = URL.createObjectURL(imageBlob);

      setImageUrl(currentImageUrl);


      setFeedback(data.feedback);
    };


    loadResume();


    return () => {
      if (currentResumeUrl) {
        URL.revokeObjectURL(currentResumeUrl);
      }

      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };

  }, [id, fs, kv]);


  return (
    <main className="pt-0">

      <nav className="resume-nav">

        <Link to="/" className="back-button">

          <img
            src="/images/back.svg"
            alt="Back"
            className="w-2.5 h-2.5"
          />

          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>

        </Link>

      </nav>



      <div className="flex flex-row w-full max-lg:flex-col-reverse">


        <section
          className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 flex items-center justify-center"
        >

          {imageUrl && resumeUrl && (

            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >

                <img
                  src={imageUrl}
                  alt="Resume Preview"
                  className="w-full h-full object-contain rounded-2xl"
                />

              </a>

            </div>

          )}

        </section>




        <section className="feedback-section">

          <h2 className="text-4xl font-bold text-black">
            Resume Review
          </h2>



          {feedback ? (

            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">


              <Summary feedback={feedback} />


              <ATS
                score={feedback?.ATS?.score ?? 0}
                suggestions={feedback?.ATS?.tips ?? []}
              />


              <Details feedback={feedback} />


            </div>


          ) : (

            <img
              src="/images/resume-scan-2.gif"
              alt="Loading"
              className="w-full"
            />

          )}


        </section>


      </div>


    </main>
  );
};


export default Resume;