import { useState, useRef, useCallback, useEffect, ReactNode } from "react";

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
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate container dimensions - fix aspect ratio calculation
	const width = size;
	const height = aspectRatio ? size / aspectRatio : size;

	// Handle mouse move for dragging (like the clock does)
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging && !disabled) {
				// Use actual element bounds for boundary detection
				const element = containerRef.current;
				if (!element) return;

				const rect = element.getBoundingClientRect();
				const actualWidth = rect.width;
				const actualHeight = rect.height;

				// Calculate new position accounting for actual element size
				const halfWidth = (actualWidth / 2 / window.innerWidth) * 100;
				const halfHeight = (actualHeight / 2 / window.innerHeight) * 100;

				const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
				const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;

				// Constrain to screen bounds using actual element size
				const constrainedX = Math.max(halfWidth, Math.min(100 - halfWidth, newX));
				const constrainedY = Math.max(halfHeight, Math.min(100 - halfHeight, newY));

				onPositionChange({ x: constrainedX, y: constrainedY });
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragOffset, onPositionChange, disabled]);

	// Hide resize handles when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setShowResizeHandles(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;
			e.preventDefault();
			setIsDragging(true);
			setDragOffset({
				x: e.clientX - (position.x * window.innerWidth) / 100,
				y: e.clientY - (position.y * window.innerHeight) / 100,
			});
		},
		[disabled, position]
	);

	const handleDoubleClick = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;
			e.preventDefault();
			setShowResizeHandles(!showResizeHandles);
		},
		[disabled, showResizeHandles]
	);

	const handleResizeStart = useCallback(
		(direction: string, event: React.MouseEvent) => {
			if (disabled) return;
			event.preventDefault();
			event.stopPropagation();
			setIsResizing(true);

			const startMouseX = event.clientX;
			const startMouseY = event.clientY;
			const startSize = size;

			const handleMouseMove = (e: MouseEvent) => {
				const deltaX = e.clientX - startMouseX;
				const deltaY = e.clientY - startMouseY;

				let delta = 0;

				// For aspect ratio components, use the larger magnitude delta for more responsive feel
				if (aspectRatio) {
					const absDeltaX = Math.abs(deltaX);
					const absDeltaY = Math.abs(deltaY);

					if (absDeltaX > absDeltaY) {
						// Use horizontal delta
						delta = direction.includes("right") ? deltaX : -deltaX;
					} else {
						// Use vertical delta
						delta = direction.includes("bottom") ? deltaY : -deltaY;
					}
				} else {
					// For free resize, use horizontal delta
					delta = direction.includes("right") ? deltaX : -deltaX;
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
		<div
			ref={containerRef}
			style={{
				position: "absolute",
				left: `${position.x}%`,
				top: `${position.y}%`,
				transform: "translate(-50%, -50%)",
				width: `${width}px`,
				height: `${height}px`,
				cursor: isDragging ? "grabbing" : "grab",
				userSelect: "none",
				zIndex: isDragging || isResizing ? 1000 : 1,
			}}
			className={className}
			onMouseDown={handleMouseDown}
			onDoubleClick={handleDoubleClick}
		>
			{children}

			{/* Resize Handles - positioned based on actual element bounds */}
			{!disabled && showResizeHandles && (
				<>
					{/* Corner Handles */}
					<div
						style={{
							position: "absolute",
							top: "-8px",
							left: "-8px",
							width: "16px",
							height: "16px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							border: "2px solid rgba(0, 0, 0, 0.8)",
							borderRadius: "50%",
							cursor: "nw-resize",
							zIndex: 1000,
						}}
						onMouseDown={(e) => handleResizeStart("top-left", e)}
					/>
					<div
						style={{
							position: "absolute",
							top: "-8px",
							right: "-8px",
							width: "16px",
							height: "16px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							border: "2px solid rgba(0, 0, 0, 0.8)",
							borderRadius: "50%",
							cursor: "ne-resize",
							zIndex: 1000,
						}}
						onMouseDown={(e) => handleResizeStart("top-right", e)}
					/>
					<div
						style={{
							position: "absolute",
							bottom: "-8px",
							left: "-8px",
							width: "16px",
							height: "16px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							border: "2px solid rgba(0, 0, 0, 0.8)",
							borderRadius: "50%",
							cursor: "sw-resize",
							zIndex: 1000,
						}}
						onMouseDown={(e) => handleResizeStart("bottom-left", e)}
					/>
					<div
						style={{
							position: "absolute",
							bottom: "-8px",
							right: "-8px",
							width: "16px",
							height: "16px",
							backgroundColor: "rgba(255, 255, 255, 0.8)",
							border: "2px solid rgba(0, 0, 0, 0.8)",
							borderRadius: "50%",
							cursor: "se-resize",
							zIndex: 1000,
						}}
						onMouseDown={(e) => handleResizeStart("bottom-right", e)}
					/>
				</>
			)}
		</div>
	);
}
