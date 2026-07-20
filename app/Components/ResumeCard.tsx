import type { Route } from "./+types/home";
import { Navbar } from "../Components/Navbar";
import ResumeCard from "../Components/ResumeCard";
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
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);

        const items = (await kv.list(
          "resume:*",
          true
        )) as KVItem[];

        if (!items || items.length === 0) {
          setResumes([]);
          return;
        }

        const parsedResumes: Resume[] = items.map((item) =>
          JSON.parse(item.value)
        );

        console.log(parsedResumes);

        setResumes(parsedResumes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated, kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & Resume Ratings</h1>

          {resumes.length === 0 && !loadingResumes ? (
            <h2>
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2>
              Review your submissions and get AI-powered feedback.
            </h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading"
              className="w-52"
            />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section mt-10">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
              />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex justify-center mt-10">
            <Link
              to="/upload"
              className="primary-button"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}