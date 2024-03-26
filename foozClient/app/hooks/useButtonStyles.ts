export const useButtonStyles = (colorCode?:
  | "Primary"
  | "Secondary"
  | "Info"
  | "Success"
  | "Alert"
  | "Warning", disabled?: boolean, padding?: string) => {
    let classColors =
    "dark:bg-zinc-700/50 dark:text-zinc-500 bg-slate-400 text-slate-800";
  
  if (colorCode && !disabled) {
    switch (colorCode) {
      case "Primary":
        classColors =
        "dark:border-sky-900 dark:bg-sky-700 dark:text-slate-200 dark:hover:bg-sky-800 bg-sky-400 text-slate-800 hover:bg-sky-300";
        break;
        case "Secondary":
          classColors =
            "dark:border-indigo-900 dark:bg-indigo-700 dark:text-slate-200 dark:hover:bg-indigo-950 bg-indigo-400 text-slate-800 hover:bg-indigo-300";
          break;
      case "Success":
        classColors =
          "dark:bg-lime-700 dark:text-slate-200 dark:hover:bg-lime-800 bg-lime-400 text-slate-800 hover:bg-lime-300";
        break;
      case "Info":
        classColors =
          "dark:bg-zinc-600 dark:text-slate-200 dark:hover:bg-zinc-700 dark:hover:text-slate-50 bg-zinc-400 text-slate-800 hover:bg-zinc-300";
        break;
      case "Warning":
        classColors =
          "dark:bg-amber-600 dark:text-slate-200 dark:hover:bg-amber-700 dark:hover:text-slate-50 bg-amber-400 text-slate-800 hover:bg-amber-300";
        break;
      case "Alert":
        classColors =
          "dark:bg-red-800 dark:text-slate-200 dark:hover:bg-red-900 dark:hover:text-slate-50 bg-red-600 text-slate-900 hover:bg-red-500";
        break;
    }
  }
  let className = `rounded ${!padding ? "p-2" : padding} ${classColors}`;
  return className;
}