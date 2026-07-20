type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  let badgeClass = "";
  let text = "";

  if (score > 69) {
    badgeClass = "bg-badge-green text-green-600";
    text = "Strong";
  } else if (score > 49) {
    badgeClass = "bg-badge-yellow text-yellow-600";
    text = "Good start";
  } else {
    badgeClass = "bg-badge-red text-pink-500";
    text = "Needs work";
  }

  return (
    <div
      className={`inline-flex px-3 py-1 rounded-full ${badgeClass}`}
    >
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default ScoreBadge;