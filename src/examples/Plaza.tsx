import {
  motion,
  useMotionValue,
  animate,
  useTransform,
  MotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

// 画布参数
const COLS = 10,
  ROWS = 10,
  CARD = 100,
  GAP = 20,
  PAD = 20;
const viewportW = 300,
  viewportH = 500;
const contentW = COLS * CARD + (COLS - 1) * GAP + PAD * 2;
const contentH = ROWS * CARD + (ROWS - 1) * GAP + PAD * 2;

// 网格步长 & 首格中心（画布坐标）
const STEP_X = CARD + GAP;
const STEP_Y = CARD + GAP;
const BASE_X = PAD + CARD / 2; // 第1格中心x
const BASE_Y = PAD + CARD / 2; // 第1格中心y

// 边界区间（画布相对容器的 translate 范围）
const minX = Math.min(0, viewportW - contentW);
const minY = Math.min(0, viewportH - contentH);
const maxX = 0,
  maxY = 0;

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
  CARD: number;       // 传进来，别用外部闭包
  COLS: number;       // 用于编号显示（row*COLS+col+1）
  minScale?: number;  // 可调
  maxScale?: number;  // 可调
  children?: React.ReactNode;
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
}: CardProps) => {
  // 这张卡片在“画布坐标系”的中心点（不随位移而变）
  const cardCX = BASE_X + col * STEP_X;
  const cardCY = BASE_Y + row * STEP_Y;

  // 1) 跟踪距离比例的 MotionValue
  const distanceRatio = useMotionValue(1);

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

  // 2) 距离越小越靠近中心：scale 从 minScale → maxScale
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
  // 位移
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 传入当前 x/y（画布 translate）、返回“将最近格心对齐到视口中心”的目标位移
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

    // 视口中心在“画布坐标系”下的位置
    const centerInCanvasX = Cx - xNow;
    const centerInCanvasY = Cy - yNow;

    // 穷举所有格心，找最近
    let bestCol = 0,
      bestRow = 0,
      bestD2 = Number.POSITIVE_INFINITY;
    for (let r = 0; r < rows; r++) {
      const cy = BASE_Y + r * STEP_Y;
      for (let c = 0; c < cols; c++) {
        const cx = BASE_X + c * STEP_X;
        const dx = cx - centerInCanvasX;
        const dy = cy - centerInCanvasY;
        const d2 = dx * dx + dy * dy; // 用平方距离避免开方
        if (d2 < bestD2) {
          bestD2 = d2;
          bestCol = c;
          bestRow = r;
        }
      }
    }

    // 最近格心（画布坐标）
    const snappedCx = BASE_X + bestCol * STEP_X;
    const snappedCy = BASE_Y + bestRow * STEP_Y;

    // 让该格心对齐到视口中心 → 需要的画布 translate
    let targetX = Cx - snappedCx;
    let targetY = Cy - snappedCy;

    // 边界夹取（防止不可达）
    targetX = Math.min(Math.max(targetX, minX), maxX);
    targetY = Math.min(Math.max(targetY, minY), maxY);

    return { targetX, targetY, bestCol, bestRow };
  }

  function settleToNearest(xNow: number, yNow: number) {
    if (settledRef.current) return;
    settledRef.current = true;

    // 停掉两轴惯性，防止抢位置
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

    // 同时开两条 spring（同一时刻发出）
    animate(x, targetX, SPRING);
    animate(y, targetY, SPRING);
  }

  // 工具
  // const clamp = (v: number, min: number, max: number) =>
  //   Math.min(Math.max(v, min), max);
  const rubber = (delta: number, overflow: number, constant = 0.15) =>
    delta / (1 + overflow * constant);

  // 动画控制句柄（用于 stop）
  const axCtrlRef = useRef<ReturnType<typeof animate> | null>(null);
  const ayCtrlRef = useRef<ReturnType<typeof animate> | null>(null);
  // 是否已 settled，防止重复 settle
  const settledRef = useRef(false);

  // 参数（可按需微调）
  const SPEED_MIN = 100; // 低速阈值（px/s），低于它直接回弹
  const EPS_DELTA = 1; // 越界早停阈值：本帧位移小于它就视为“已停”
  const SPRING = { type: "spring" as const, stiffness: 500, damping: 40 };
  const INERTIA = { type: "inertia" as const, power: 0.5, timeConstant: 350 };

  // 新手势开始：停掉未完成惯性，保证跟手
  const onPanStart = () => {
    axCtrlRef.current?.stop();
    ayCtrlRef.current?.stop();
    settledRef.current = false;
  };

  // 拖拽阶段：rubber 软边界
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

  // 松手：惯性（软夹）+ 越界早停 + 回弹
  const onPanEnd = (_: any, info: { velocity: { x: number; y: number } }) => {
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    // 低速：直接联合吸附（一次性给出 x/y 目标）
    if (Math.hypot(vx, vy) < SPEED_MIN) {
      settleToNearest(x.get(), y.get());
      return;
    }

    const targetX = x.get() + vx * 0.5;
    const targetY = y.get() + vy * 0.5;

    // —— X 轴惯性：软夹 + 早停 —— //
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
            // 提前终结惯性，联合吸附
            settleToNearest(next, y.get());
          } else {
            x.set(next);
          }
        } else {
          x.set(v);
        }
      },
    });

    // —— Y 轴惯性：软夹 + 早停 —— //
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
          // if (Math.abs(next - last) < EPS_DELTA) {
          //   ayCtrlRef.current?.stop();
          //   animate(y, clamp(next, minY, maxY), SPRING);
          // } else {
          //   y.set(next);
          // }
          if (Math.abs(next - last) < EPS_DELTA) {
            // 提前终结惯性，联合吸附
            settleToNearest(x.get(), next);
          } else {
            y.set(next);
          }
        } else {
          y.set(v);
        }
      },
    });

    // 兜底，如果都没触发早停，则联合吸附
    Promise.all([
      axCtrlRef.current!.finished,
      ayCtrlRef.current!.finished,
    ]).then(() => {
      if (!settledRef.current) {
        settleToNearest(x.get(), y.get());
      }
    });
  };

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
          >
            {i + 1}
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
