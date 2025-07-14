interface MessageProps {
	size?: number;
	text: string;
	fontSize?: number; // Override for custom font sizing
}

export function Message({ size = 300, text, fontSize }: MessageProps) {
	const calculatedFontSize = fontSize || Math.max(16, size * 0.08);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				padding: "16px",
				color: "white",
				textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
				textAlign: "center",
				background: "rgba(0, 0, 0, 0.2)",
				borderRadius: "12px",
				border: "1px solid rgba(255, 255, 255, 0.1)",
				backdropFilter: "blur(10px)",
				boxSizing: "border-box",
			}}
			aria-label={`Message: ${text}`}
		>
			<div
				style={{
					fontSize: `${calculatedFontSize}px`,
					fontWeight: "400",
					fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
					lineHeight: 1.4,
					wordWrap: "break-word",
					overflow: "hidden",
				}}
			>
				{text || "Click to edit message"}
			</div>
		</div>
	);
}
