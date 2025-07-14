import { motion } from "framer-motion";

interface ToggleSwitchProps {
	isOn: boolean;
	onToggle: () => void;
	label?: string;
}

const spring = {
	type: "spring",
	stiffness: 700,
	damping: 30,
};

export function ToggleSwitch({ isOn, onToggle, label }: ToggleSwitchProps) {
	return (
		<div className="flex items-center gap-4">
			<div
				className={`flex-shrink-0 w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${
					isOn ? "bg-blue-500 justify-end" : "bg-gray-600 justify-start"
				}`}
				onClick={onToggle}
			>
				<motion.div className="w-6 h-6 bg-white rounded-full shadow-md" layout transition={spring} />
			</div>
			{label && <span className="text-white font-medium">{label}</span>}
		</div>
	);
}
