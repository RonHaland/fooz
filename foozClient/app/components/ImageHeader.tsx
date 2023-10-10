type Props = {
  src: string;
  alt: string | "";
  text: string;
};
export const ImageHeader = ({ src = "", alt = "", text = "" }: Props) => {
  return (
    <div className="relative mx-8 md:mx-16 my-8 h-48  lg:h-80 overflow-hidden rounded grid grid-cols-5 grid-rows-4 gap-1">
      <img
        className="object-cover absolute top-0 bottom-0 left-0 right-0 w-full h-full blur-sm"
        src={src}
        alt={alt}
        loading="lazy"
      />
      <div className="relative bg-slate-800 rounded-r row-start-2 sm:row-start-3 col-span-3 sm:col-span-2 flex justify-end">
        <h1 className="text-2xl lg:text-6xl text-slate-100 text-end mx-4">
          {text}
        </h1>
      </div>
    </div>
  );
};
