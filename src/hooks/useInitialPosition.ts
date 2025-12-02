import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * 计算组件的初始位置，使其位于容器（默认为视口）的右下角，并留出指定边距。
 * @param nodeRef - 拖拽组件自身的 DOM 元素引用 (RefObject)。用于获取组件自身的宽度/高度。
 * @param margin - 距离容器边缘的最小距离（默认为 50px）。
 * @returns 计算出的初始坐标 { x, y }，如果尚未计算完成则返回 undefined。
 */
interface InitialType {
  initialPos?: { x: number; y: number };
  initialLoading: RefObject<boolean>;
}
export const useInitialPosition = (draggableNodeRef: RefObject<HTMLElement> | null, margin: number = 50, containerRef?: RefObject<HTMLElement>): InitialType => {
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const hasCalculated = useRef(false); // 防止多次计算
  const loading = useRef(false);

  const calculatePosition = () => {
    // 确保拖拽组件已渲染
    const draggableNode = draggableNodeRef?.current;
    console.log('draggableNode', draggableNode);
    if (!draggableNode) return;
    loading.current = true;

    // 1. 获取拖拽组件自身的尺寸
    const nodeRect = draggableNode.getBoundingClientRect();
    const nodeWidth = nodeRect.width;
    const nodeHeight = nodeRect.height;
    const nodeLeft = nodeRect.left;
    const nodeTop = nodeRect.top;
    console.log('nodeRect', nodeRect);

    let containerWidth: number;
    let containerHeight: number;

    // 2. 确定容器尺寸 (默认为视口)
    if (containerRef?.current) {
      // 容器是传入的 Ref 元素
      const containerRect = containerRef.current.getBoundingClientRect();
      containerWidth = containerRect.width;
      containerHeight = containerRect.height;
      // 🚨 注意：如果 Draggable 是 fixed 定位，这里需要考虑容器相对于视口的位置
      // containerLeft = containerRect.left;
      // containerTop = containerRect.top;
    } else {
      // 容器是整个视口
      containerWidth = window.innerWidth;
      containerHeight = window.innerHeight;
    }

    console.log('containerWidth', containerWidth); // 1541
    console.log('containerHeight', containerHeight); // 582

    // 3. 计算右下角位置
    // x = 容器宽度 - 组件宽度 - 边距 (+ 容器左侧偏移，用于修正 fixed/absolute 坐标系)
    const x = containerWidth - nodeLeft - nodeWidth - margin;
    // y = 容器高度 - 组件高度 - 边距 (+ 容器顶部偏移)
    const y = containerHeight - nodeTop - nodeHeight - margin;

    // 4. 更新状态
    setInitialPos({ x, y });
    hasCalculated.current = true;
    loading.current = false;
  };

  useEffect(() => {
    // console.log('hasCalculated', hasCalculated.current);
    // 初始计算
    // if (!hasCalculated.current) calculatePosition();
    calculatePosition();

    // 监听窗口大小变化和组件加载，以重新计算
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleResize);

    // 🚨 触发一次计算，确保在组件挂载后获取到尺寸
    const timer = setTimeout(calculatePosition, 0);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [draggableNodeRef, containerRef, margin]); // 依赖项变化时重新绑定或计算

  return {
    initialPos,
    initialLoading: loading
  };
};
