import { DraggableContainer, Position } from "../DraggableContainer";
import { Message } from "./Message";

interface DraggableMessageProps {
	size: number;
	position: Position;
	onPositionChange: (position: Position) => void;
	onSizeChange: (size: number) => void;
	text: string;
	onTextChange?: (text: string) => void;
}

export function DraggableMessage({ size, position, onPositionChange, onSizeChange, text }: DraggableMessageProps) {
	return (
		<DraggableContainer
			size={size}
			position={position}
			onPositionChange={onPositionChange}
			onSizeChange={onSizeChange}
			minSize={150}
			maxSize={800}
			className="select-none"
		>
			<Message size={size} text={text} />
		</DraggableContainer>
	);
}
