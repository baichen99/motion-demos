import {
  motion,
  useMotionValue,
  animate,
  useTransform,
  MotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";

const COLS = 10,
  ROWS = 10,
  CARD = 100,
  GAP = 20,
  PAD = 20;
const viewportW = 300,
  viewportH = 500;
const contentW = COLS * CARD + (COLS - 1) * GAP + PAD * 2;
const contentH = ROWS * CARD + (ROWS - 1) * GAP + PAD * 2;

const STEP_X = CARD + GAP;
const STEP_Y = CARD + GAP;
const BASE_X = PAD + CARD / 2;
const BASE_Y = PAD + CARD / 2;

const minX = Math.min(0, viewportW - contentW);
const minY = Math.min(0, viewportH - contentH);
const maxX = 0,
  maxY = 0;

function snapToNearestBySearch(
  xNow: number,
  yNow: number,
  viewportW: number,
  viewportH: number,
  cols: number,
  rows: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) {
  const Cx = viewportW / 2;
  const Cy = viewportH / 2;

  const centerInCanvasX = Cx - xNow;
  const centerInCanvasY = Cy - yNow;

  let bestCol = 0,
    bestRow = 0,
    bestD2 = Number.POSITIVE_INFINITY;
  for (let r = 0; r < rows; r++) {
    const cy = BASE_Y + r * STEP_Y;
    for (let c = 0; c < cols; c++) {
      const cx = BASE_X + c * STEP_X;
      const dx = cx - centerInCanvasX;
      const dy = cy - centerInCanvasY;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        bestCol = c;
        bestRow = r;
      }
    }
  }

  const snappedCx = BASE_X + bestCol * STEP_X;
  const snappedCy = BASE_Y + bestRow * STEP_Y;

  let targetX = Cx - snappedCx;
  let targetY = Cy - snappedCy;

  targetX = Math.min(Math.max(targetX, minX), maxX);
  targetY = Math.min(Math.max(targetY, minY), maxY);

  return { targetX, targetY, bestCol: bestCol, bestRow: bestRow };
}

type CardProps = {
  col: number;
  row: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  viewportW: number;
  viewportH: number;
  BASE_X: number;
  BASE_Y: number;
  STEP_X: number;
  STEP_Y: number;
  CARD: number;
  COLS: number;
  minScale?: number;
  maxScale?: number;
  children?: React.ReactNode;
  centerX: number;
  centerY: number;
};
const Card = ({
  col,
  row,
  x,
  y,
  viewportW,
  viewportH,
  BASE_X,
  BASE_Y,
  STEP_X,
  STEP_Y,
  CARD,
  COLS,
  minScale = 0.85,
  maxScale = 1.20,
  children,
  centerX,
  centerY,
}: CardProps) => {
  const cardCX = BASE_X + col * STEP_X;
  const cardCY = BASE_Y + row * STEP_Y;

  const maxDist = Math.hypot(viewportW / 2, viewportH / 2);
  const initialDist = Math.hypot(cardCX - centerX, cardCY - centerY);
  const distanceRatio = useMotionValue(Math.min(initialDist / maxDist, 1));

  useEffect(() => {
    const maxDist = Math.hypot(viewportW / 2, viewportH / 2);

    const update = () => {
      const tx = x.get();
      const ty = y.get();
      const cx = viewportW / 2 - tx;
      const cy = viewportH / 2 - ty;
      const dx = cardCX - cx;
      const dy = cardCY - cy;
      const dist = Math.hypot(dx, dy);
      distanceRatio.set(Math.min(dist / maxDist, 1));
    };

    update();
    const unsubX = x.on("change", update);
    const unsubY = y.on("change", update);

    return () => {
      unsubX();
      unsubY();
    };
  }, [CARD, BASE_X, BASE_Y, STEP_X, STEP_Y, cardCX, cardCY, distanceRatio, viewportH, viewportW, x, y]);

  const scaleRaw = useTransform(distanceRatio, (v) => minScale + (maxScale - minScale) * (1 - v));
  const scale = useSpring(scaleRaw, { stiffness: 320, damping: 38, mass: 0.25 });


  return (
    <motion.div
      className="card"
      style={{
        width: CARD,
        height: CARD,
        transformOrigin: "center",
        scale,
        background: "green",
        borderRadius: 8,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
      }}
    >
      {children ?? row * COLS + col + 1}
    </motion.div>
  );
}

export default function Plaza() {
  const initialSnap = useMemo(() => {
    const snap = snapToNearestBySearch(
      0,
      0,
      viewportW,
      viewportH,
      COLS,
      ROWS,
      minX,
      maxX,
      minY,
      maxY
    );
    const centerX = viewportW / 2 - snap.targetX;
    const centerY = viewportH / 2 - snap.targetY;
    return { ...snap, centerX, centerY };
  }, []);

  const x = useMotionValue(initialSnap.targetX);
  const y = useMotionValue(initialSnap.targetY);

  function settleToNearest(xNow: number, yNow: number) {
    if (settledRef.current) return;
    settledRef.current = true;

    axCtrlRef.current?.stop();
    ayCtrlRef.current?.stop();

    const { targetX, targetY } = snapToNearestBySearch(
      xNow,
      yNow,
      viewportW,
      viewportH,
      COLS,
      ROWS,
      minX,
      maxX,
      minY,
      maxY
    );

    animate(x, targetX, SPRING);
    animate(y, targetY, SPRING);
  }

  const rubber = (delta: number, overflow: number, constant = 0.15) =>
    delta / (1 + overflow * constant);

  const axCtrlRef = useRef<ReturnType<typeof animate> | null>(null);
  const ayCtrlRef = useRef<ReturnType<typeof animate> | null>(null);
  const settledRef = useRef(false);

  const SPEED_MIN = 100;
  const EPS_DELTA = 1;
  const SPRING = { type: "spring" as const, stiffness: 500, damping: 40 };
  const INERTIA = { type: "inertia" as const, power: 0.5, timeConstant: 350 };

  const onPanStart = () => {
    axCtrlRef.current?.stop();
    ayCtrlRef.current?.stop();
    settledRef.current = false;
  };

  const onPan = (_: any, info: { delta: { x: number; y: number } }) => {
    let nextX = x.get() + info.delta.x;
    let nextY = y.get() + info.delta.y;

    const overflowLeft = Math.max(0, minX - nextX);
    const overflowRight = Math.max(0, nextX - maxX);
    const overflowTop = Math.max(0, minY - nextY);
    const overflowBottom = Math.max(0, nextY - maxY);

    if (overflowLeft > 0 || overflowRight > 0) {
      nextX =
        x.get() + rubber(info.delta.x, Math.max(overflowLeft, overflowRight));
    }
    if (overflowTop > 0 || overflowBottom > 0) {
      nextY =
        y.get() + rubber(info.delta.y, Math.max(overflowTop, overflowBottom));
    }

    x.set(nextX);
    y.set(nextY);
  };

  const onPanEnd = (_: any, info: { velocity: { x: number; y: number } }) => {
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    if (Math.hypot(vx, vy) < SPEED_MIN) {
      settleToNearest(x.get(), y.get());
      return;
    }

    const targetX = x.get() + vx * 0.5;
    const targetY = y.get() + vy * 0.5;

    axCtrlRef.current = animate(x, targetX, {
      ...INERTIA,
      onUpdate: (v) => {
        const left = Math.max(0, minX - v);
        const right = Math.max(0, v - maxX);
        if (left > 0 || right > 0) {
          const overflow = Math.max(left, right);
          const last = x.get();
          const delta = v - last;
          const next = last + rubber(delta, overflow);
          if (Math.abs(next - last) < EPS_DELTA) {
            settleToNearest(next, y.get());
          } else {
            x.set(next);
          }
        } else {
          x.set(v);
        }
      },
    });

    ayCtrlRef.current = animate(y, targetY, {
      ...INERTIA,
      onUpdate: (v) => {
        const top = Math.max(0, minY - v);
        const bottom = Math.max(0, v - maxY);
        if (top > 0 || bottom > 0) {
          const overflow = Math.max(top, bottom);
          const last = y.get();
          const delta = v - last;
          const next = last + rubber(delta, overflow);
          if (Math.abs(next - last) < EPS_DELTA) {
            settleToNearest(x.get(), next);
          } else {
            y.set(next);
          }
        } else {
          y.set(v);
        }
      },
    });

    Promise.all([
      axCtrlRef.current!.finished,
      ayCtrlRef.current!.finished,
    ]).then(() => {
      if (!settledRef.current) {
        settleToNearest(x.get(), y.get());
      }
    });
  };

  useEffect(() => {
    const { targetX, targetY } = snapToNearestBySearch(
      x.get(),
      y.get(),
      viewportW,
      viewportH,
      COLS,
      ROWS,
      minX,
      maxX,
      minY,
      maxY
    );
    x.set(targetX);
    y.set(targetY);
    settledRef.current = true;
  }, [x, y]);

  return (
    <motion.div
      onPanStart={onPanStart}
      onPan={onPan}
      onPanEnd={onPanEnd}
      style={{
        width: viewportW,
        height: viewportH,
        border: "2px solid red",
        overflow: "hidden",
        position: "relative",
        touchAction: "none",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <motion.div
        style={{
          x,
          y,
          position: "absolute",
          left: 0,
          top: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CARD}px)`,
          gridAutoRows: `${CARD}px`,
          gap: GAP,
          padding: PAD,
          willChange: "transform",
          background: "rgba(0,0,0,.5)",
        }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <Card
            key={i}
            col={i % COLS}
            row={Math.floor(i / COLS)}
            x={x}
            y={y}
            viewportW={viewportW}
            viewportH={viewportH}
            BASE_X={BASE_X}
            BASE_Y={BASE_Y}
            STEP_X={STEP_X}
            STEP_Y={STEP_Y}
            CARD={CARD}
            COLS={COLS}
            minScale={0.75}
            maxScale={1.10}
        centerX={initialSnap.centerX}
        centerY={initialSnap.centerY}
          >
            {i + 1}
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
