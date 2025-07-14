import { DraggableContainer, Position } from "../DraggableContainer";
import { DayOfWeek } from "./DayOfWeek";

interface DraggableDayOfWeekProps {
	size: number;
	position: Position;
	onPositionChange: (position: Position) => void;
	onSizeChange: (size: number) => void;
	format?: "full" | "short" | "abbreviated";
}

export function DraggableDayOfWeek({
	size,
	position,
	onPositionChange,
	onSizeChange,
	format = "full",
}: DraggableDayOfWeekProps) {
	return (
		<DraggableContainer
			size={size}
			position={position}
			onPositionChange={onPositionChange}
			onSizeChange={onSizeChange}
			minSize={100}
			maxSize={600}
			className="select-none"
		>
			<DayOfWeek size={size} format={format} />
		</DraggableContainer>
	);
}
