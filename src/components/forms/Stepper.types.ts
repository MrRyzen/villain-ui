import type { Snippet } from "svelte";

export type StepState = 'idle' | 'active' | 'completed' | 'error' | 'loading';
export type ValidationMode = 'strict' | 'loose' | 'submit-only';

export interface StepRegistration {
	id: string;
	label: string;
	fields?: string[];
	optional?: boolean;
	order?: number;
}

export interface StepContext {
	registerStep: (step: StepRegistration) => void;
	unregisterStep: (id: string) => void;
	currentStepId: string;
	getStepState: (id: string) => StepState;
}

export interface StepMeta {
	id: string;
	label: string;
	fields: string[];
	optional: boolean;
	state: StepState;
}

export interface StepperFormContext {
	// Navigation
	next: () => Promise<boolean>;
	back: () => void;
	goto: (stepId: string) => Promise<boolean>;

	// State
	currentStep: number;
	currentStepId: string;
	totalSteps: number;
	canNext: boolean;
	canBack: boolean;
	isFirstStep: boolean;
	isLastStep: boolean;

	// Step info
	steps: StepMeta[];

	// Validation
	validateCurrentStep: () => Promise<boolean>;
	getStepErrors: (stepId: string) => string[];
}

export interface StepConfig {
	id: string;
	label: string;
	description?: string;
	icon?: Snippet;
	state?: StepState;
	disabled?: boolean;
}
