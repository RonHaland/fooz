"use client";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
type Props = {
  count?: number;
  donut?: boolean;
};

export const Confetti = ({ count = 35, donut = false }: Props) => {
  const maxDelay = count / 100;
  const particles = [...Array(count).keys()].map((p) => (
    <Particle maxDelay={maxDelay} key={p} donut={donut} />
  ));

  return (
    <div className="absolute inset-0 isolate -translate-y-4">{particles}</div>
  );
};

const Particle = ({
  maxDelay,
  donut = false,
}: {
  maxDelay: number;
  donut?: boolean;
}) => {
  const [config, setConfig] = useState({
    targetx: 0,
    diffY: 0,
    rotation: 90,
    delay: 0,
    color: 0,
  });

  const classColors = [
    "bg-blue-500",
    "bg-fuchsia-600",
    "bg-red-700",
    "bg-lime-500",
    "bg-rose-500",
    "bg-white",
    "bg-amber-400",
  ];

  useEffect(() => {
    setConfig({
      targetx: 150 - Math.random() * 300,
      diffY: Math.random() * 40,
      rotation: Math.random() * 360,
      delay: Math.random() * maxDelay,
      color: Math.floor(Math.random() * classColors.length),
    });
  }, [classColors.length, maxDelay]);
  const topHeight = 400;

  return (
    <motion.div
      initial={{
        translateX: 0,
        translateY: 0,
        rotate: config.rotation,
      }}
      style={{
        opacity: 0,
      }}
      animate={{
        translateX: [
          0,
          (3 * config.targetx) / 8,
          (6 * config.targetx) / 8,
          config.targetx,
        ],
        translateY: [
          0,
          -0.73 * topHeight + config.diffY,
          -1 * topHeight + config.diffY,
          -0.73 * topHeight + config.diffY,
          -0.45 * topHeight + config.diffY,
          0 + config.diffY,
          0.33 * topHeight + config.diffY,
        ],
        rotate: [config.rotation],
        opacity: [100, 100, 100, 100],
      }}
      transition={{
        type: "keyframes",
        ease: "linear",
        delay: config.delay,
        duration: 0.7,
      }}
      className={`h-1 w-2 bg-blue-500 rounded-[1px] absolute inset-[50%] ${
        donut ? "bg-transparent" : classColors[config.color]
      }`}
    >
      {donut ? "🍩" : ""}
    </motion.div>
  );
};
