import { useState, useRef, useEffect } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { AnalogClock } from "./AnalogClock";
import { DigitalClock } from "./DigitalClock";
import { formatDate } from "../../utils/dateFormat";

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
		const baseSize = config.components.clock.size.width;

		if (config.components.clock.type === "analog") {
			// Analog clock: baseSize directly controls the clock diameter
			const padding = 16;
			const size = baseSize + padding * 2;
			const height = size + (config.components.clock.showDate ? 40 : 0);
			return { width: size, height, clockSize: baseSize };
		} else {
			// Digital clock: use baseSize more directly for responsive feel
			const digitalWidth = Math.max(200, baseSize * 1.2); // Direct scaling with slight multiplier
			const digitalHeight = Math.max(80, digitalWidth * 0.35); // Proportional height
			const padding = 24;
			const width = digitalWidth + padding * 2;
			const height = digitalHeight + padding * 2 + (config.components.clock.showDate ? 40 : 0);
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
				const minContainerSize = 150; // Minimum visual container size
				// Calculate max size based on screen dimensions
				const screenPadding = 50;
				const maxWidthBasedOnScreen = window.innerWidth - screenPadding * 2;
				const maxHeightBasedOnScreen = window.innerHeight - screenPadding * 2;
				const maxContainerSize = Math.min(maxWidthBasedOnScreen, maxHeightBasedOnScreen);

				// Use the larger of width or height for 1:1 mouse scaling
				const newContainerSize = Math.max(minContainerSize, Math.min(maxContainerSize, Math.max(newWidth, newHeight)));

				// Derive base clock size from container size
				let newBaseSize;
				if (config.components.clock.type === "analog") {
					// For analog: baseSize = containerSize - padding - dateSpace
					const padding = 32; // 16 * 2
					const dateSpace = config.components.clock.showDate ? 40 : 0;
					newBaseSize = newContainerSize - padding - dateSpace;
				} else {
					// For digital: reverse the calculation from getContainerDimensions
					const padding = 48; // 24 * 2
					// digitalWidth = baseSize * 1.2, so baseSize = digitalWidth / 1.2
					newBaseSize = (newContainerSize - padding) / 1.2;
				}

				newBaseSize = Math.max(100, newBaseSize); // Ensure minimum base size

				updateClock({
					size: { width: newBaseSize, height: newBaseSize },
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
			x: e.clientX - (config.components.clock.position.x * window.innerWidth) / 100,
			y: e.clientY - (config.components.clock.position.y * window.innerHeight) / 100,
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
			width: containerWidth, // Use actual visual container size
			height: containerHeight, // Use actual visual container size
		});
	};

	const formatDateString = () => {
		const now = new Date();
		return formatDate(now, config.components.clock.dateFormat);
	};

	return (
		<div
			ref={containerRef}
			style={{
				position: "absolute",
				left: `${config.components.clock.position.x}%`,
				top: `${config.components.clock.position.y}%`,
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
					padding: config.components.clock.type === "digital" ? "20px 24px" : "16px", // Better vertical padding for digital
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
					gap: config.components.clock.type === "digital" ? "12px" : "16px", // Balanced gap for both types
				}}
			>
				{/* Date Display - Moved to top */}
				{config.components.clock.showDate && (
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
						{formatDateString()}
					</div>
				)}

				{/* Clock Component */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexShrink: 0,
						...(config.components.clock.type === "digital" && {
							height: `${digitalHeight}px`,
							width: `${clockSize}px`,
						}),
					}}
				>
					{config.components.clock.type === "analog" ? (
						<AnalogClock size={clockSize} />
					) : (
						<DigitalClock size={clockSize} />
					)}
				</div>

				{/* Date Display - Removed from bottom */}

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
