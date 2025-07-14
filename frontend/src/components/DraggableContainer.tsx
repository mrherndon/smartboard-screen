import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

export interface Position {
	x: number;
	y: number;
}

interface DraggableContainerProps {
	children: ReactNode;
	size: number;
	position: Position;
	onPositionChange: (position: Position) => void;
	onSizeChange: (size: number) => void;
	minSize?: number;
	maxSize?: number;
	aspectRatio?: number; // width/height ratio, undefined for free resize
	className?: string;
	disabled?: boolean;
}

export function DraggableContainer({
	children,
	size,
	position,
	onPositionChange,
	onSizeChange,
	minSize = 50,
	maxSize = 800,
	aspectRatio,
	className = "",
	disabled = false,
}: DraggableContainerProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [showResizeHandles, setShowResizeHandles] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleDragStart = useCallback(() => {
		if (disabled) return;
		setIsDragging(true);
	}, [disabled]);

	const handleDragEnd = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleDrag = useCallback(
		(_event: any, info: any) => {
			if (disabled) return;
			const container = containerRef.current?.parentElement;
			if (!container) return;

			const containerRect = container.getBoundingClientRect();
			// Convert drag offset to percentage directly
			const deltaXPercent = (info.offset.x / containerRect.width) * 100;
			const deltaYPercent = (info.offset.y / containerRect.height) * 100;

			const newX = Math.max(0, Math.min(100, position.x + deltaXPercent));
			const newY = Math.max(0, Math.min(100, position.y + deltaYPercent));

			onPositionChange({ x: newX, y: newY });
		},
		[onPositionChange, disabled, position]
	);

	const handleResizeStart = useCallback(
		(direction: string, event: React.MouseEvent) => {
			if (disabled) return;
			event.stopPropagation();
			setIsResizing(true);

			const startMouseX = event.clientX;
			const startMouseY = event.clientY;
			const startSize = size;

			const handleMouseMove = (e: MouseEvent) => {
				const deltaX = e.clientX - startMouseX;
				const deltaY = e.clientY - startMouseY;

				let delta = 0;
				if (direction.includes("right") || direction.includes("bottom")) {
					delta = aspectRatio ? Math.max(deltaX, deltaY) : deltaX;
				} else {
					delta = aspectRatio ? Math.min(-deltaX, -deltaY) : -deltaX;
				}

				const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta * 2));
				onSizeChange(newSize);
			};

			const handleMouseUp = () => {
				setIsResizing(false);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[size, onSizeChange, minSize, maxSize, aspectRatio, disabled]
	);

	const width = aspectRatio ? size : size;
	const height = aspectRatio ? size / aspectRatio : size;

	const handleDoubleClick = () => {
		if (!disabled) {
			setShowResizeHandles(!showResizeHandles);
		}
	};

	// Auto-hide resize handles after 5 seconds
	useEffect(() => {
		if (showResizeHandles) {
			const timer = setTimeout(() => {
				setShowResizeHandles(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [showResizeHandles]);

	return (
		<motion.div
			ref={containerRef}
			drag={!disabled && !isResizing}
			dragMomentum={false}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDrag={handleDrag}
			onDoubleClick={handleDoubleClick}
			style={{
				position: "absolute",
				left: `${position.x}%`,
				top: `${position.y}%`,
				width: `${width}px`,
				height: `${height}px`,
				cursor: isDragging ? "grabbing" : "grab",
				zIndex: isDragging || isResizing ? 1000 : 1,
			}}
			className={className}
		>
			{children}

			{/* Resize Handles */}
			{!disabled && showResizeHandles && (
				<>
					{/* Corner Handles */}
					<div
						className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-nw-resize opacity-80 hover:opacity-100 transition-opacity"
						onMouseDown={(e) => handleResizeStart("top-left", e)}
					/>
					<div
						className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-ne-resize opacity-80 hover:opacity-100 transition-opacity"
						onMouseDown={(e) => handleResizeStart("top-right", e)}
					/>
					<div
						className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-sw-resize opacity-80 hover:opacity-100 transition-opacity"
						onMouseDown={(e) => handleResizeStart("bottom-left", e)}
					/>
					<div
						className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-se-resize opacity-80 hover:opacity-100 transition-opacity"
						onMouseDown={(e) => handleResizeStart("bottom-right", e)}
					/>
				</>
			)}
		</motion.div>
	);
}
