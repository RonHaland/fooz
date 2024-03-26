type Props = {
  children?: any;
};

export const RankedBoard = ({ children }: Props) => {
  return (
    <table className="table-fixed w-full text-slate-200">
      <thead className="border-b-2 border-slate-100/40">
        <tr>
          <th className="hidden sm:table-cell w-[10%]">Position</th>
          <th className="sm:hidden w-[10%]">Pos</th>
          <th className="w-[60%]">Name</th>
          <th className="w-[30%]">Rating</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
