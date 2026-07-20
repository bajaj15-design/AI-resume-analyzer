import type { Route } from "./+types/home";
import { Navbar } from "../Components/Navbar";
import { ResumeCard } from "../Components/ResumeCard";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Resume feedback app" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const result = (await kv.list("resume:*", true)) as KVItem[] | undefined;

      if (!result) {
        setResumes([]);
        setLoadingResumes(false);
        return;
      }

      const parsedResumes: Resume[] = result.map((item) =>
        JSON.parse(item.value)
      );

      console.log("parsedResumes:", parsedResumes);

      setResumes(parsedResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & Resume Ratings</h1>

          {loadingResumes ? (
            <h2>Loading resumes...</h2>
          ) : resumes.length === 0 ? (
            <h2>
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2>Review your submissions and get AI-powered feedback.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading"
              className="w-[200px]"
            />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section mt-10">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center m-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}