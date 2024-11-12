type Props = {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const getNumbersToRender = (
  currentPage: number,
  pages: number[]
): (number | "...")[] => {
  const end = pages.length - 1;

  if (end < 6) {
    return pages;
  }
  console.log(`${currentPage}/${end}`);
  if (currentPage <= 3) {
    console.log("front");
    return [...pages.slice(0, 4), "...", pages[end]];
  }
  if (currentPage >= end - 1) {
    console.log("back");
    return [pages[0], "...", ...pages.slice(end - 3)];
  }

  console.log("middle");
  return [
    pages[0],
    "...",
    ...pages.slice(currentPage - 2, currentPage + 1),
    "...",
    pages[end],
  ];
};

export const Pagination = ({ page, totalPages, setPage }: Props) => {
  const displayPage = Math.max(1, Math.min(page, totalPages));

  const enableBackArrow = displayPage > 1;
  const enableForwArrow = displayPage < totalPages;

  const numbers = [...Array(totalPages).keys()];
  const numbersToRender = getNumbersToRender(displayPage, numbers);

  const pageButtons = numbersToRender.map((a, i) => {
    if (a === "...") {
      return <div key={-1 * i}>...</div>;
    }
    const myPage = a + 1;
    const isCurrentPage = myPage === displayPage;
    return (
      <button
        className={`flex flex-col justify-center rounded-full text-slate-100 ${
          isCurrentPage
            ? "bg-sky-900 cursor-default"
            : "bg-sky-600 cursor-pointer"
        } border border-black/20 w-8 h-8 text-center align-middle leading-none`}
        key={myPage}
        onClick={() => setPage(myPage)}
      >
        {myPage}
      </button>
    );
  });

  const handleBack = () => {
    setPage((p) => p - 1);
  };
  const handleForw = () => {
    setPage((p) => p + 1);
  };

  return (
    <div className="flex flex-row gap-3">
      <PaginationArrow
        direction="back"
        enabled={enableBackArrow}
        onclick={handleBack}
      />
      {pageButtons}
      <PaginationArrow
        direction="forward"
        enabled={enableForwArrow}
        onclick={handleForw}
      />
    </div>
  );
};

type ArrowProps = {
  direction?: "back" | "forward";
  enabled?: boolean;
  onclick?: () => void;
};

const PaginationArrow = ({
  direction = "back",
  enabled = true,
  onclick,
}: ArrowProps) => {
  const arrow = direction === "back" ? "<" : ">";
  const className = `flex flex-col justify-center rounded-full w-8 h-8 text-center text-lg ${
    enabled ? "cursor-pointer" : "cursor-default text-slate-400/20"
  }`;

  return enabled ? (
    <button onClick={onclick} className={className}>
      {arrow}
    </button>
  ) : (
    <span className={className}>{arrow}</span>
  );
};
