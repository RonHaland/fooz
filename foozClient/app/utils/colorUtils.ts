export const getCompletedColor = (
  winningTeam: number,
  myTeam: number,
  score: number
) => {
  let classColors = "";
  const neutralColor = "border-amber-500 border bg-amber-500/20";
  const winningColor = (score: number) => {
    return score > 1 ? "border-green-400 border bg-green-800/50" : neutralColor;
  };
  const losingColor = "border-red-400 border bg-red-800/50";
  switch (winningTeam) {
    case 1:
      classColors = myTeam == 1 ? winningColor(score) : losingColor;
      break;
    case 2:
      classColors = myTeam == 2 ? winningColor(score) : losingColor;
      break;
    case 0:
      classColors = neutralColor;
      break;
    default:
      break;
  }

  return classColors;
};
