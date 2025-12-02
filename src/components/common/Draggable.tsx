import { useDraggable, useDndMonitor, DragEndEvent } from '@dnd-kit/core';
import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  boundaryRef?: React.RefObject<HTMLElement>;
  initialPosition?: { x: number; y: number };
}

const Draggable: React.FC<DraggableProps> = ({ id, children, boundaryRef, initialPosition = { x: 0, y: 0 } }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // 1. 使用 initialPosition 初始化 position 状态 (这是拖拽的“锚点”)
  const [position, setPosition] = useState(initialPosition);

  // 2. useSpring 动画状态
  const [{ x, y }, api] = useSpring(
    () => ({
      x: position.x,
      y: position.y,
      config: { tension: 300, friction: 25 }
    }),
    [position]
  );

  const nodeRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setPosition(initialPosition);
  // }, [initialPosition]);

  // 3. 实时拖拽更新
  useEffect(() => {
    if (transform) {
      // 拖拽时：位置 = position (锚点) + transform (实时偏移)
      api.start({
        x: position.x + transform.x,
        y: position.y + transform.y,
        immediate: true // 拖拽时立即更新，无动画
      });
    }
    //  else {
    //   // 拖拽停止后，transform 为 null，让 useSpring 恢复到 position 的值（如果有动画就会触发）
    //   api.start({
    //     x: initialPosition.x,
    //     y: initialPosition.y,
    //     immediate: false // 恢复到锚点时使用动画
    //   });
    // }
  }, [transform, position, api]);

  // 在 Draggable 组件内部
  const clamp = (nextX: number, nextY: number) => {
    const bounds = boundaryRef?.current?.getBoundingClientRect();
    const node = nodeRef.current?.getBoundingClientRect();

    if (!bounds || !node) {
      // 如果没有边界，直接返回，这是可以跑到屏幕外的原因之一
      return { x: nextX, y: nextY };
    }

    const boundaryWidth = bounds.width;
    const boundaryHeight = bounds.height;
    const nodeWidth = node.width;
    const nodeHeight = node.height;
    const marginDistance = 20;

    // --- Y 轴钳制 ---
    // Y 轴的 Min/Max 应该相对于 boundaryRef 的顶部/底部
    const minY = marginDistance;
    const maxY = boundaryHeight - nodeHeight - marginDistance;
    const clampedY = Math.min(Math.max(nextY, minY), maxY);

    // --- X 轴吸附和钳制 ---
    const minX = 0;
    // 关键点：maxX 必须是边界宽度减去元素宽度
    const maxX = boundaryWidth - nodeWidth;

    // 1. 先进行 X 轴钳制，确保 nextX 不超过边界
    const initialClampedX = Math.min(Math.max(nextX, minX), maxX);

    // 2. 吸附逻辑：基于钳制后的位置进行判断
    let finalX: number;
    const midpoint = boundaryWidth / 2;

    // 使用元素中心点 (initialClampedX + nodeWidth / 2) 与边界中心点 midpoint 进行比较
    if (initialClampedX + nodeWidth / 2 < midpoint) {
      // 吸附到左边缘 (0)
      finalX = minX;
    } else {
      // 吸附到右边缘 (boundaryWidth - nodeWidth)
      finalX = maxX;
    }

    return {
      // 使用吸附后的 finalX
      x: finalX,
      y: clampedY
    };
  };

  // 5. 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== id) return;

    // 修复 Bug 1：使用 event.delta (相对于拖拽开始时的偏移) 来计算新的**理论**位置
    // 或者更稳妥地，使用 dnd-kit 最终计算的 `transform`
    // const finalTransform = event.activatorEvent.data?.current?.transform || { x: 0, y: 0 }; // 某些版本 dnd-kit 可能需要

    // dnd-kit 官方推荐使用 event.delta，因为它直接提供了从拖拽开始到结束的净移动量。
    const nextX = position.x + event.delta.x;
    const nextY = position.y + event.delta.y;

    // 2. 应用边界限制和吸附
    const target = clamp(nextX, nextY);

    // 3. 更新 React 状态/锚点
    setPosition(target);

    // 4. useSpring 动画将由 useEffect(..., [transform, position]) 触发，transform 变为 null 后，
    // api.start({ x: target.x, y: target.y, immediate: false }) 会被调用。
    // 为了确保立即触发，也可以在这里再次调用 api.start，但通常 useEffect 机制已经足够。
  };

  useDndMonitor({ onDragEnd: handleDragEnd });

  return (
    <animated.div
      ref={node => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      // 使用 x, y 作为 style props
      style={{ x, y }}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing select-none fixed z-99999999"
    >
      {children}
      {/* <div className="text-[red] mt-1">
        <div>
          {position.x.toFixed(2)}-{position.y.toFixed(2)}
        </div>
        <div> </div>
      </div> */}
    </animated.div>
  );
};

export default Draggable;
