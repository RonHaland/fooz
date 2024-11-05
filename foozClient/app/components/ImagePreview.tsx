export const ImagePreview = () => {
  const className =
    "w-[33%] [clip-path:polygon(0_0,100%_0,100%_100%,20%_100%)]";
  return (
    <div className="relative flex flex-row border-4 lg:border-[1rem] border-slate-950 bg-slate-950 lg:rounded-lg m-8">
      <img src="images/Fooz1.webp" alt="" className="relative w-[33%]" />
      <div className={`${className} ml-[-6%] bg-slate-950`}></div>
      <img
        src="images/Fooz2.webp"
        alt=""
        className={`relative ${className} ml-[-27%]`}
      />
      <div className={`${className} ml-[-6%] bg-slate-950`}></div>
      <img
        src="images/Fooz3.webp"
        alt=""
        className={`relative ${className} ml-[-27%]`}
      />
      <div className={`${className} ml-[-6%] bg-slate-950`}></div>
      <img
        src="images/Fooz4.webp"
        alt=""
        className={`relative ${className} ml-[-27%]`}
      />
    </div>
  );
};
