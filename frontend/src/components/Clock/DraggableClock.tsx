import { useConfig } from "../../contexts/ConfigContext";
import { AnalogClock } from "./AnalogClock";
import { DigitalClock } from "./DigitalClock";
import { formatDate } from "../../utils/dateFormat";
import { DraggableContainer, Position } from "../DraggableContainer";

// Create a Clock component that follows the same pattern as Message and Timer
interface ClockProps {
	size: number;
}

function Clock({ size }: ClockProps) {
	const { config } = useConfig();

	const formatDateString = () => {
		const now = new Date();
		return formatDate(now, config.components.clock.dateFormat);
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				padding: config.components.clock.type === "digital" ? "20px 24px" : "16px",
				borderRadius: "12px",
				backgroundColor: "rgba(0, 0, 0, 0.3)",
				backdropFilter: "blur(8px)",
				border: "1px solid rgba(255, 255, 255, 0.2)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: config.components.clock.type === "digital" ? "12px" : "16px",
				boxSizing: "border-box",
			}}
		>
			{/* Date Display */}
			{config.components.clock.showDate && (
				<div
					style={{
						color: "white",
						fontSize: `${Math.max(12, size * 0.08)}px`,
						fontWeight: 500,
						textAlign: "center",
						textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						maxWidth: "90%",
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
					flexGrow: 1,
					width: "100%",
					height: "100%",
				}}
			>
				{config.components.clock.type === "analog" ? (
					<AnalogClock size={size * 0.6} />
				) : (
					<DigitalClock size={size * 0.6} />
				)}
			</div>
		</div>
	);
}

interface DraggableClockProps {
	position: Position;
	size: number;
	onPositionChange: (position: Position) => void;
	onSizeChange: (size: number) => void;
}

export function DraggableClock({ position, size, onPositionChange, onSizeChange }: DraggableClockProps) {
	return (
		<DraggableContainer
			position={position}
			size={size}
			onPositionChange={onPositionChange}
			onSizeChange={onSizeChange}
			minSize={100}
			maxSize={800}
			aspectRatio={1}
		>
			<Clock size={size} />
		</DraggableContainer>
	);
}
