import ScoreGauge from "~/Components/ScoreGauge";
import ScoreBadge from "~/Components/ScoreBadge";

type SummaryProps = {
  feedback: Feedback;
};

const Category = ({ title, score,
}: { title: string; score: number;}) => {


const textColor = score >  70 ? 'text-green-600':score > 49 ? 'text-yellow-600' : 'text-pink-500';

  return (
    <div className="resume-summary">
     <div className="flex flex-col gap-2">
  <p className="text-2xl">{title}</p>

  <ScoreBadge score={score} />
   </div>
          
       <p>
          <span className={textColor}>  {score} </span>/100
     
        </p>


      </div>
     
  
  );
};

const Summary = ({ feedback }: SummaryProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Your Resume Score
          </h2>

          <p className="text-sm text-gray-500">
            This score is calculated based on variables listed below.
          </p>
        </div>
      </div>

      <Category
        title="Tone & Style"
        score={feedback.toneAndStyle.score}
      />

      <Category
        title="Content"
        score={feedback.content.score}
      />

      <Category
        title="Structure"
        score={feedback.structure.score}
      />

      <Category
        title="Skills"
        score={feedback.skills.score}
      />
    </div>
  );
};

export default Summary;