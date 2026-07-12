import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";


export const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback }
}: { resume: Resume }) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in-duration-1000"
    >
      <div className="resume-card-header">
      <div className="flex flex-col gap-2">
        <h2 className="text-black! font-bold wrap-break-words">
          {companyName}
        </h2>

        <h3 className="text-lg wrap-break-words text-gray-500">
          {jobTitle}
        </h3>
</div>
      <div className="flex-shrink-0">
        <ScoreCircle score={feedback.overallScore} />
      </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000 w-full">
  <div className="w-full">
          <img 
  src={imagePath}
  alt="resume"
  className="w-full h-[420px] sm:h-[450px] object-cover object-top rounded-xl"
/>
        </div>
        </div>
    </Link>
  );
};