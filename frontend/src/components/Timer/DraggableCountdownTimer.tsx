import { DraggableContainer, Position } from "../DraggableContainer";
import { CountdownTimer } from "./CountdownTimer";

interface DraggableCountdownTimerProps {
	size: number;
	position: Position;
	onPositionChange: (position: Position) => void;
	onSizeChange: (size: number) => void;
}

export function DraggableCountdownTimer({
	size,
	position,
	onPositionChange,
	onSizeChange,
}: DraggableCountdownTimerProps) {
	return (
		<DraggableContainer
			size={size}
			position={position}
			onPositionChange={onPositionChange}
			onSizeChange={onSizeChange}
			minSize={200}
			maxSize={800}
			aspectRatio={1.2} // Slightly taller than wide for timer
			className="select-none"
		>
			<CountdownTimer size={size} />
		</DraggableContainer>
	);
}
