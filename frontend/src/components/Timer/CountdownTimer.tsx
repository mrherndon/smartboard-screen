import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
	size?: number;
}

export function CountdownTimer({ size = 250 }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState(0); // seconds
	const [isRunning, setIsRunning] = useState(false);
	const [inputMinutes, setInputMinutes] = useState(5);
	const [inputSeconds, setInputSeconds] = useState(0);

	useEffect(() => {
		let interval: number;

		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((time) => {
					if (time <= 1) {
						setIsRunning(false);
						return 0;
					}
					return time - 1;
				});
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [isRunning, timeLeft]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const handleStart = useCallback(() => {
		if (timeLeft === 0) {
			setTimeLeft(inputMinutes * 60 + inputSeconds);
		}
		setIsRunning(true);
	}, [timeLeft, inputMinutes, inputSeconds]);

	const handlePause = useCallback(() => {
		setIsRunning(false);
	}, []);

	const handleReset = useCallback(() => {
		setIsRunning(false);
		setTimeLeft(0);
	}, []);

	const handleSetTime = useCallback(() => {
		setIsRunning(false);
		setTimeLeft(inputMinutes * 60 + inputSeconds);
	}, [inputMinutes, inputSeconds]);

	const isFinished = timeLeft === 0 && !isRunning;
	const isSetup = timeLeft === 0;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: `${size}px`,
				minHeight: `${Math.max(200, size * 0.8)}px`,
				padding: "20px",
				color: "white",
				textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
				textAlign: "center",
				background: isFinished ? "rgba(239, 68, 68, 0.3)" : "rgba(0, 0, 0, 0.2)",
				borderRadius: "16px",
				border: `2px solid ${isFinished ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.1)"}`,
				backdropFilter: "blur(10px)",
				gap: "12px",
			}}
			aria-label="Countdown timer"
		>
			{/* Timer Display */}
			<div
				style={{
					fontSize: `${Math.max(24, size * 0.15)}px`,
					fontWeight: "600",
					fontFamily: "monospace",
					letterSpacing: "0.1em",
					color: isFinished ? "#ff6b6b" : "white",
				}}
			>
				{formatTime(timeLeft)}
			</div>

			{/* Setup Controls - shown when timer is at 0 */}
			{isSetup && (
				<div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
					<input
						type="number"
						min="0"
						max="59"
						value={inputMinutes}
						onChange={(e) => setInputMinutes(Math.max(0, parseInt(e.target.value) || 0))}
						style={{
							width: "50px",
							padding: "4px",
							textAlign: "center",
							background: "rgba(255, 255, 255, 0.1)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							borderRadius: "4px",
							color: "white",
							fontSize: "14px",
						}}
					/>
					<span style={{ fontSize: "14px" }}>min</span>
					<input
						type="number"
						min="0"
						max="59"
						value={inputSeconds}
						onChange={(e) => setInputSeconds(Math.max(0, parseInt(e.target.value) || 0))}
						style={{
							width: "50px",
							padding: "4px",
							textAlign: "center",
							background: "rgba(255, 255, 255, 0.1)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							borderRadius: "4px",
							color: "white",
							fontSize: "14px",
						}}
					/>
					<span style={{ fontSize: "14px" }}>sec</span>
					<button
						onClick={handleSetTime}
						style={{
							padding: "4px 8px",
							background: "rgba(59, 130, 246, 0.3)",
							border: "1px solid rgba(59, 130, 246, 0.5)",
							borderRadius: "4px",
							color: "white",
							fontSize: "12px",
							cursor: "pointer",
						}}
					>
						Set
					</button>
				</div>
			)}

			{/* Control Buttons */}
			<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
				{!isRunning ? (
					<button
						onClick={handleStart}
						disabled={timeLeft === 0 && inputMinutes === 0 && inputSeconds === 0}
						style={{
							padding: "8px 16px",
							background: "rgba(34, 197, 94, 0.3)",
							border: "1px solid rgba(34, 197, 94, 0.5)",
							borderRadius: "8px",
							color: "white",
							fontSize: "14px",
							cursor: "pointer",
							opacity: timeLeft === 0 && inputMinutes === 0 && inputSeconds === 0 ? 0.5 : 1,
						}}
					>
						Start
					</button>
				) : (
					<button
						onClick={handlePause}
						style={{
							padding: "8px 16px",
							background: "rgba(245, 158, 11, 0.3)",
							border: "1px solid rgba(245, 158, 11, 0.5)",
							borderRadius: "8px",
							color: "white",
							fontSize: "14px",
							cursor: "pointer",
						}}
					>
						Pause
					</button>
				)}

				<button
					onClick={handleReset}
					style={{
						padding: "8px 16px",
						background: "rgba(107, 114, 128, 0.3)",
						border: "1px solid rgba(107, 114, 128, 0.5)",
						borderRadius: "8px",
						color: "white",
						fontSize: "14px",
						cursor: "pointer",
					}}
				>
					Reset
				</button>
			</div>

			{/* Finished Message */}
			{isFinished && (
				<div
					style={{
						fontSize: `${Math.max(16, size * 0.08)}px`,
						fontWeight: "500",
						color: "#ff6b6b",
						animation: "pulse 1s infinite",
					}}
				>
					Time's Up!
				</div>
			)}
		</div>
	);
}
