type Props = {
  children?: any;
};

export const Scoreboard = ({ children }: Props) => {
  return (
    <table className="table-fixed w-full text-slate-200">
      <thead className="border-b-2 border-slate-100/40">
        <tr>
          <th className="w-fit">Position</th>
          <th>Name</th>
          <th>Score</th>
          <th>Games</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
