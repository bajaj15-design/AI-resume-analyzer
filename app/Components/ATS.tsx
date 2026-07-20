import { cn } from "~/lib/utils";

type ATSProps = {
  score: number;
  suggestions: {
    type: "good" | "improve";
    tip: string;
  }[];
};

const ATS = ({ score, suggestions }: ATSProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-md w-full bg-linear-to-b to-white p-8 flex flex-col gap-4",
        score > 69
          ? "from-green-100"
          : score > 49
          ? "from-yellow-100"
          : "from-red-100"
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={
            score > 69
              ? "/icons/ats-good.svg"
              : score > 49
              ? "/icons/ats-warning.svg"
              : "/icons/ats-bad.svg"
          }
          alt="ATS"
          className="w-10 h-10"
        />

        <p className="text-2xl font-bold text-gray-800">
          ATS Score - {score}/100
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xl font-semibold">
          How well does your resume pass through Applicant Tracking Systems?
        </p>

        <p className="text-gray-500">
          Your resume was scanned like an employer would. Here's how it
          performed:
        </p>

        {suggestions?.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-2">
            <img
              src={
                suggestion.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              alt=""
              className="w-4 h-4"
            />

            <p className="text-gray-600">{suggestion.tip}</p>
          </div>
        ))}

        <p className="text-gray-500">
          Want a better score? Improve your resume by applying the suggestions
          listed below.
        </p>
      </div>
    </div>
  );
};

export default ATS;