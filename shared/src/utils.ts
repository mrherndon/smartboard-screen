// Utility functions shared between frontend and backend

import { ScheduleEntry, DayOfWeek, TimeRange } from "./types";

/**
 * Format a time string for display
 */
export function formatTime(time: string, format: "12h" | "24h" = "12h"): string {
	const date = new Date(time);
	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "2-digit",
		hour12: format === "12h",
	};
	return date.toLocaleTimeString("en-US", options);
}

/**
 * Get the current day of week (0 = Sunday)
 */
export function getCurrentDayOfWeek(): DayOfWeek {
	return new Date().getDay() as DayOfWeek;
}

/**
 * Check if a schedule entry is currently active
 */
export function isScheduleActive(entry: ScheduleEntry, now: Date = new Date()): boolean {
	const startTime = new Date(entry.startTime);
	const endTime = new Date(entry.endTime);
	return now >= startTime && now <= endTime && entry.isActive;
}

/**
 * Get time until a schedule entry starts (in milliseconds)
 */
export function getTimeUntilStart(entry: ScheduleEntry, now: Date = new Date()): number {
	const startTime = new Date(entry.startTime);
	return Math.max(0, startTime.getTime() - now.getTime());
}

/**
 * Get time until a schedule entry ends (in milliseconds)
 */
export function getTimeUntilEnd(entry: ScheduleEntry, now: Date = new Date()): number {
	const endTime = new Date(entry.endTime);
	return Math.max(0, endTime.getTime() - now.getTime());
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number, format: "full" | "compact" = "full"): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (format === "compact") {
		if (days > 0) return `${days}d ${hours % 24}h`;
		if (hours > 0) return `${hours}h ${minutes % 60}m`;
		if (minutes > 0) return `${minutes}m`;
		return `${seconds}s`;
	}

	// Full format
	const parts: string[] = [];
	if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
	if (hours > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? "s" : ""}`);
	if (minutes > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? "s" : ""}`);
	if (parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

	return parts.join(", ");
}

/**
 * Get schedule entries for a specific day
 */
export function getScheduleForDay(entries: ScheduleEntry[], dayOfWeek: DayOfWeek): ScheduleEntry[] {
	return entries
		.filter((entry) => entry.dayOfWeek === dayOfWeek && entry.isActive)
		.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

/**
 * Get the current and next classes
 */
export function getCurrentAndNextClasses(
	entries: ScheduleEntry[],
	now: Date = new Date()
): {
	current: ScheduleEntry | null;
	next: ScheduleEntry | null;
} {
	const todayEntries = getScheduleForDay(entries, getCurrentDayOfWeek());

	const current = todayEntries.find((entry) => isScheduleActive(entry, now)) || null;

	let next: ScheduleEntry | null = null;
	for (const entry of todayEntries) {
		if (new Date(entry.startTime) > now) {
			next = entry;
			break;
		}
	}

	return { current, next };
}

/**
 * Validate time range
 */
export function isValidTimeRange(range: TimeRange): boolean {
	const start = new Date(range.start);
	const end = new Date(range.end);
	return start < end && !isNaN(start.getTime()) && !isNaN(end.getTime());
}

/**
 * Check if two time ranges overlap
 */
export function timeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
	const start1 = new Date(range1.start);
	const end1 = new Date(range1.end);
	const start2 = new Date(range2.start);
	const end2 = new Date(range2.end);

	return start1 < end2 && start2 < end1;
}

/**
 * Generate a random hex color
 */
export function generateRandomColor(): string {
	const colors = [
		"#4F46E5", // Indigo
		"#059669", // Emerald
		"#DC2626", // Red
		"#D97706", // Amber
		"#7C3AED", // Violet
		"#0891B2", // Cyan
		"#BE185D", // Pink
		"#65A30D", // Lime
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Sanitize string for display
 */
export function sanitizeString(str: string): string {
	return str.trim().replace(/[<>]/g, "");
}

/**
 * Create a time range from start and end times
 */
export function createTimeRange(start: string, end: string): TimeRange {
	return { start, end };
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
	const targetDate = new Date(date);
	const today = new Date();
	return targetDate.toDateString() === today.toDateString();
}
