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

	// Calculate container dimensions based on clock type and settings
	const getContainerDimensions = () => {
		const baseSize = config.clock.size.width;
		const padding = 24; // Increased padding for better visual balance

		if (config.clock.type === "analog") {
			// Analog clock: container size matches clock size with padding
			const width = baseSize + padding * 2;
			const height = baseSize + padding * 2 + (config.clock.showDate ? 40 : 0);
			return { width, height, clockSize: baseSize };
		} else {
			// Digital clock: more compact container, size based on text readability
			const digitalHeight = Math.max(60, baseSize * 0.4); // More reasonable height for digital
			const digitalWidth = Math.max(200, baseSize); // Maintain width for readability
			const width = digitalWidth + padding * 2;
			const height = digitalHeight + padding * 2 + (config.clock.showDate ? 40 : 0);
			return { width, height, clockSize: digitalWidth, digitalHeight };
		}
	};

	const { width: containerWidth, height: containerHeight, clockSize, digitalHeight } = getContainerDimensions();

	// Handle mouse move for dragging and resizing
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				// Calculate new position accounting for container size to prevent leaving screen
				const halfWidth = (containerWidth / 2 / window.innerWidth) * 100;
				const halfHeight = (containerHeight / 2 / window.innerHeight) * 100;

				const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
				const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;

				// Constrain to screen bounds
				const constrainedX = Math.max(halfWidth, Math.min(100 - halfWidth, newX));
				const constrainedY = Math.max(halfHeight, Math.min(100 - halfHeight, newY));

				updateClock({
					position: { x: constrainedX, y: constrainedY },
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
				// Calculate max size based on screen dimensions - no hard limit
				const screenPadding = 50;
				const maxWidthBasedOnScreen = window.innerWidth - screenPadding * 2;
				const maxHeightBasedOnScreen = window.innerHeight - screenPadding * 2;
				const maxSize = Math.min(maxWidthBasedOnScreen, maxHeightBasedOnScreen);

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
	}, [
		isDragging,
		isResizing,
		dragOffset,
		resizeStart,
		currentResizeHandle,
		updateClock,
		containerWidth,
		containerHeight,
	]);

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
					padding: "24px", // Increased padding for better visual balance
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
					gap: "12px",
				}}
			>
				{/* Clock Component */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexShrink: 0,
						...(config.clock.type === "digital" && {
							height: `${digitalHeight}px`,
							width: `${clockSize}px`,
						}),
					}}
				>
					{config.clock.type === "analog" ? <AnalogClock size={clockSize} /> : <DigitalClock size={clockSize} />}
				</div>

				{/* Date Display */}
				{config.clock.showDate && (
					<div
						style={{
							color: "white",
							fontSize: `${Math.max(12, clockSize * 0.08)}px`,
							fontWeight: 500,
							textAlign: "center",
							textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							maxWidth: `${clockSize}px`,
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
