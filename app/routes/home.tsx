import type { Route } from "./+types/home";
import { Navbar } from "../Components/Navbar";
import { ResumeCard } from "../Components/ResumeCard";
import { resumes } from "../constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Resume feedback app" },
  ];
}

export default function Home() {
  console.log("resumes: ", resumes);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className = "page-heading py-16">
        <div className="page-heading">
          <h1>Track your Applications & Resume Ratings</h1>
          <h2>Review your submissions and get AI-powered feedback</h2>
       </div> </div>
      </section>

{resumes.length > 0 && (
<div className="resumes-section mt-10">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}

      </div>
      )}
    </main>
  );
}