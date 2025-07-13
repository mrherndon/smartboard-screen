import { useState, useRef, useEffect } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { AnalogClock } from "./AnalogClock";
import { DigitalClock } from "./DigitalClock";

interface ResizeHandle {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	cursor: string;
}

const RESIZE_HANDLES: ResizeHandle[] = [
	{ position: "top-left", cursor: "nw-resize" },
	{ position: "top-right", cursor: "ne-resize" },
	{ position: "bottom-left", cursor: "sw-resize" },
	{ position: "bottom-right", cursor: "se-resize" },
];

export function DraggableClock() {
	const { config, updateClock } = useConfig();
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [showResizeHandles, setShowResizeHandles] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [currentResizeHandle, setCurrentResizeHandle] = useState<string>("");
	const containerRef = useRef<HTMLDivElement>(null);

	// Handle mouse move for dragging and resizing
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
				const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
				updateClock({
					position: {
						x: Math.max(0, Math.min(100, newX)),
						y: Math.max(0, Math.min(100, newY)),
					},
				});
			}

			if (isResizing) {
				const deltaX = e.clientX - resizeStart.x;
				const deltaY = e.clientY - resizeStart.y;

				let newWidth = resizeStart.width;
				let newHeight = resizeStart.height;

				// Calculate new dimensions based on resize handle
				switch (currentResizeHandle) {
					case "top-left":
						newWidth = resizeStart.width - deltaX;
						newHeight = resizeStart.height - deltaY;
						break;
					case "top-right":
						newWidth = resizeStart.width + deltaX;
						newHeight = resizeStart.height - deltaY;
						break;
					case "bottom-left":
						newWidth = resizeStart.width - deltaX;
						newHeight = resizeStart.height + deltaY;
						break;
					case "bottom-right":
						newWidth = resizeStart.width + deltaX;
						newHeight = resizeStart.height + deltaY;
						break;
				}

				// Maintain aspect ratio and enforce minimum size
				const minSize = 100;
				const maxSize = 400;
				const size = Math.max(minSize, Math.min(maxSize, Math.max(newWidth, newHeight)));

				updateClock({
					size: { width: size, height: size },
				});
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
			setCurrentResizeHandle("");
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, isResizing, dragOffset, resizeStart, currentResizeHandle, updateClock]);

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

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDragging(true);
		setDragOffset({
			x: e.clientX - (config.clock.position.x * window.innerWidth) / 100,
			y: e.clientY - (config.clock.position.y * window.innerHeight) / 100,
		});
	};

	const handleDoubleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowResizeHandles(!showResizeHandles);
	};

	const handleResizeStart = (e: React.MouseEvent, handle: string) => {
		e.preventDefault();
		e.stopPropagation();
		setIsResizing(true);
		setCurrentResizeHandle(handle);
		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			width: config.clock.size.width,
			height: config.clock.size.height,
		});
	};

	const formatDate = () => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Calculate container dimensions based on clock size and date display
	const containerWidth = config.clock.size.width + 32; // 16px padding on each side
	const containerHeight = config.clock.size.height + 32 + (config.clock.showDate ? 30 : 0); // padding + date height

	return (
		<div
			ref={containerRef}
			style={{
				position: "absolute",
				left: `${config.clock.position.x}%`,
				top: `${config.clock.position.y}%`,
				transform: "translate(-50%, -50%)",
				cursor: isDragging ? "grabbing" : "grab",
				userSelect: "none",
				zIndex: 10,
			}}
			onMouseDown={handleMouseDown}
			onDoubleClick={handleDoubleClick}
		>
			<div
				className="skim-background"
				style={{
					padding: "16px",
					borderRadius: "12px",
					backgroundColor: "rgba(0, 0, 0, 0.3)",
					backdropFilter: "blur(8px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					position: "relative",
					width: `${containerWidth}px`,
					height: `${containerHeight}px`,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "8px",
				}}
			>
				{/* Clock Component */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexShrink: 0,
					}}
				>
					{config.clock.type === "analog" ? (
						<AnalogClock size={config.clock.size.width} />
					) : (
						<DigitalClock size={config.clock.size.width} />
					)}
				</div>

				{/* Date Display */}
				{config.clock.showDate && (
					<div
						style={{
							color: "white",
							fontSize: `${Math.max(12, config.clock.size.width * 0.08)}px`,
							fontWeight: 500,
							textAlign: "center",
							textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							maxWidth: `${config.clock.size.width}px`,
							flexShrink: 0,
						}}
					>
						{formatDate()}
					</div>
				)}

				{/* Resize Handles */}
				{showResizeHandles && (
					<>
						{RESIZE_HANDLES.map((handle) => (
							<div
								key={handle.position}
								style={{
									position: "absolute",
									width: "16px",
									height: "16px",
									backgroundColor: "rgba(255, 255, 255, 0.8)",
									border: "2px solid rgba(0, 0, 0, 0.8)",
									borderRadius: "50%",
									cursor: handle.cursor,
									zIndex: 1000,
									...(handle.position === "top-left" && { top: "-8px", left: "-8px" }),
									...(handle.position === "top-right" && { top: "-8px", right: "-8px" }),
									...(handle.position === "bottom-left" && { bottom: "-8px", left: "-8px" }),
									...(handle.position === "bottom-right" && { bottom: "-8px", right: "-8px" }),
								}}
								onMouseDown={(e) => handleResizeStart(e, handle.position)}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
