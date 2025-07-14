// Shared types for the smartboard application

export interface ScheduleEntry {
	id: string;
	title: string;
	startTime: string; // ISO 8601 format
	endTime: string; // ISO 8601 format
	dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
	location?: string;
	instructor?: string;
	isActive: boolean;
	color?: string; // Hex color for UI theming
	userId: string; // Owner of this schedule entry
	schoolId?: string; // Optional school/location identifier
	notes?: string; // Additional notes
	createdAt: string; // ISO 8601 format
	updatedAt: string; // ISO 8601 format
}

export interface ComponentConfig {
	isActive: boolean;
	// Add other component-specific settings here if needed
}

export interface ClockConfig extends ComponentConfig {
	type: "analog" | "digital";
	showDate: boolean;
	size: {
		width: number;
		height: number;
	};
	position: {
		x: number; // percentage
		y: number; // percentage
	};
}

export interface AppConfig {
	id: string;
	userId: string; // Owner of this configuration
	backgroundImageUrl?: string;
	backgroundRotation: {
		enabled: boolean;
		interval: number; // minutes
		groupId?: string; // ID of image group to rotate through
	};
	components: {
		clock: ClockConfig;
		// Add other components here, e.g., schedule, weather
	};
	clockFormat: "12h" | "24h";
	clockStyle: "analog" | "digital";
	timezone: string;
	theme: "light" | "dark";
	refreshInterval: number; // seconds
	displaySettings: {
		showLocation: boolean;
		showInstructor: boolean;
		countdownFormat: "full" | "compact";
		showNextClass: boolean;
		maxUpcomingClasses: number;
		skrimOpacity: number; // 0-1 for background contrast
		skrimColor: string; // Color for background skrims
	};
	createdAt: string;
	updatedAt: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: any;
	};
}

export interface AuthToken {
	token: string;
	expiresIn: number;
	type: "Bearer";
}

export interface HealthStatus {
	status: "healthy" | "unhealthy" | "degraded";
	timestamp: string;
	version: string;
	database: "connected" | "disconnected" | "error";
	uptime: number; // seconds
}

// Utility types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeRange {
	start: string; // ISO 8601 format
	end: string; // ISO 8601 format
}

export interface ClassStatus {
	current: ScheduleEntry | null;
	next: ScheduleEntry | null;
	upcoming: ScheduleEntry[];
	timeUntilNext: number | null; // milliseconds
	timeUntilCurrent: number | null; // milliseconds (if class hasn't started)
}

// Error types
export type ApiErrorCode =
	| "VALIDATION_ERROR"
	| "NOT_FOUND"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "INTERNAL_ERROR"
	| "DATABASE_ERROR"
	| "NETWORK_ERROR";

export interface ValidationError {
	field: string;
	message: string;
	value?: any;
}

// Request/Response types for new features
export interface CreateScheduleRequest {
	title: string;
	startTime: string;
	endTime: string;
	dayOfWeek: DayOfWeek;
	location?: string;
	instructor?: string;
	color?: string;
	schoolId?: string;
	notes?: string;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
	isActive?: boolean;
}

export interface CreateWeeklyScheduleRequest {
	name: string;
	schoolId?: string;
	schedule: {
		[key in DayOfWeek]?: CreateScheduleRequest[];
	};
}

export interface UpdateWeeklyScheduleRequest extends Partial<CreateWeeklyScheduleRequest> {
	isActive?: boolean;
}

export interface CreateImageGroupRequest {
	name: string;
	description?: string;
	imageIds: string[];
}

export interface UpdateImageGroupRequest extends Partial<CreateImageGroupRequest> {}

export interface UploadImageRequest {
	file: any; // File object (browser) or buffer (Node.js)
	groupId?: string;
}

export interface UpdateConfigRequest extends Partial<Omit<AppConfig, "id" | "userId" | "createdAt" | "updatedAt">> {}

export interface LoginRequest {
	googleToken: string; // Google OAuth token
}

export interface CreateSchoolRequest {
	name: string;
	address?: string;
	timezone: string;
}

// Event types for real-time updates
export type ScheduleEvent =
	| { type: "SCHEDULE_CREATED"; data: ScheduleEntry }
	| { type: "SCHEDULE_UPDATED"; data: ScheduleEntry }
	| { type: "SCHEDULE_DELETED"; data: { id: string } };

export type ConfigEvent = { type: "CONFIG_UPDATED"; data: AppConfig };

// Constants
export const DEFAULT_CONFIG: Omit<AppConfig, "id" | "userId" | "createdAt" | "updatedAt"> = {
	backgroundRotation: {
		enabled: false,
		interval: 30, // 30 minutes
	},
	components: {
		clock: {
			isActive: true,
			type: "digital",
			showDate: true,
			size: { width: 300, height: 300 },
			position: { x: 50, y: 50 },
		},
	},
	clockFormat: "12h",
	clockStyle: "analog",
	timezone: "America/New_York",
	theme: "dark",
	refreshInterval: 30,
	displaySettings: {
		showLocation: true,
		showInstructor: true,
		countdownFormat: "full",
		showNextClass: true,
		maxUpcomingClasses: 3,
		skrimOpacity: 0.7,
		skrimColor: "#000000",
	},
};

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const TIME_FORMATS = {
	"12h": "h:mm A",
	"24h": "HH:mm",
} as const;

export interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
	role: "admin" | "user";
	schoolId?: string;
	createdAt: string;
	updatedAt: string;
	lastLoginAt: string;
}

export interface ImageGroup {
	id: string;
	name: string;
	description?: string;
	userId: string;
	imageIds: string[];
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface BackgroundImage {
	id: string;
	filename: string;
	originalName: string;
	url: string;
	thumbnailUrl?: string;
	userId: string;
	size: number; // bytes
	mimeType: string;
	width?: number;
	height?: number;
	uploadedAt: string;
}

export interface School {
	id: string;
	name: string;
	address?: string;
	timezone: string;
	adminUsers: string[]; // User IDs
	createdAt: string;
	updatedAt: string;
}

// Google OAuth types
export interface GoogleOAuthUser {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
}

// Weekly schedule structure
export interface WeeklySchedule {
	id: string;
	userId: string;
	name: string;
	schoolId?: string;
	isActive: boolean;
	schedule: {
		[key in DayOfWeek]: ScheduleEntry[];
	};
	createdAt: string;
	updatedAt: string;
}
