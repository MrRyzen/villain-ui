/**
 * @file step.types.ts
 * @description Type definitions for the step wizard component system
 */

import type { ReadableAtom } from "nanostores";
import type { Readable, Subscriber, Unsubscriber, Writable } from "svelte/store";

/**
 * Core step state representing the current status of a step.
 */
export type StepState =
	| 'idle'
	| 'active'
	| 'completed'
	| 'error'
	| 'loading';

/**
 * Orientation and layout options for the step wizard.
 */
export type StepOrientation =
	| 'horizontal'
	| 'vertical-left'
	| 'vertical-right';

/**
 * Step type defining the behavior at this step.
 * - 'step': Regular navigation step (validate and proceed)
 * - 'submit': Form submission step (triggers form submit)
 */
export type StepType = 'step' | 'submit';

export type JumpPolicy = 'free' | 'no-enter' | 'no-exit' | 'locked';

/**
 * Step definition representing the author's intent for a step.
 * @template TId - The type of the step identifier
 */
export interface StepDefinition<TId extends string = string> {
	/** Stable identifier – NEVER index-based */
	id: TId;

	/** Optional display label (rail/header only) */
	label?: string;

	/** Optional description or subtitle */
	description?: string;

	/** Optional icon or glyph key */
	icon?: string;

	/** Step is optional (can be skipped) */
	optional?: boolean;

	/** Step cannot be interacted with */
	disabled?: boolean;

	/**
	 * Step behavior type.
	 * - 'step': Regular navigation step (default)
	 * - 'submit': Form submission step (triggers form submit instead of next)
	 */
	type?: StepType;

	/** Form data i.e. the name, email, etc. */
	data?: string[];

	/** Handles jump policy logic */
	jumpPolicy?: JumpPolicy;
}

/**
 * Derived runtime step containing both definition and computed state.
 * Used internally and exposed to consumers.
 * @template TId - The type of the step identifier
 * @extends StepDefinition
 */
export interface StepRuntime<TId extends string = string>
	extends StepDefinition<TId> {
	/** The zero-based index of this step */
	index: number;

	/** Has the user visited this step */
	visited: boolean;

	/** Has this step been explicitly completed */
	completed: boolean;

	/** Is this the current step */
	active: boolean;

	/** Computed state based on loading, completed, active, and visited flags */
	state: StepState;

	/** Validation status (if applicable) */
	valid?: boolean;
}

/**
 * Navigation rules controlling how users can move between steps.
 */
export interface StepNavigationRules {
	/** Allow going back to previous steps */
	allowBackNavigation?: boolean;

	/** Allow clicking future steps directly */
	allowFutureNavigation?: boolean;

	/** Lock navigation while loading */
	lockWhileLoading?: boolean;
}

/**
 * Context provided to step change guards and hooks.
 * @template TId - The type of the step identifier
 */
export interface StepChangeContext<TId extends string = string> {
	/** The step being navigated from */
	from: StepRuntime<TId>;

	/** The step being navigated to */
	to: StepRuntime<TId>;

	/** The direction of navigation */
	direction: 'forward' | 'backward' | 'jump';
}

/**
 * Guard function called before step transitions.
 * @template TId - The type of the step identifier
 * @param context - The step change context
 * @returns {boolean | Promise<boolean>} Return false to cancel the transition
 */
export type StepGuard<TId extends string = string> =
	(context: StepChangeContext<TId>) =>
		boolean | Promise<boolean>;

/**
 * Callback functions for step controller events.
 * @template TId - The type of the step identifier
 */
export interface StepCallbacks<TId extends string = string> {
	/** Called before a step change occurs; return false to cancel */
	onBeforeStepChange?: StepGuard<TId>;

	/** Called after a step change completes */
	onStepChange?: (step: StepRuntime<TId>) => void;

	/** Called when a step is marked as completed */
	onStepComplete?: (step: StepRuntime<TId>) => void;

	/** Called when an error occurs on a step */
	onError?: (step: StepRuntime<TId>, errors?: unknown) => void;
}

/**
 * Validator configuration for a step.
 * Used for Superforms integration.
 */
export interface StepValidator {
	/** Adapter-specific validator (zod4, valibot, etc.) */
	validator: unknown;

	/** Validate automatically on next() */
	validateOnNext?: boolean;
}

/**
 * Configuration options for creating a step controller.
 * @template TId - The type of the step identifier
 * @extends StepCallbacks
 */
export interface StepControllerOptions<TId extends string = string>
	extends StepCallbacks<TId> {
	/** Array of step definitions */
	steps: StepDefinition<TId>[];

	/** Initial step to display */
	initialStepId?: TId;

	/** Layout orientation */
	orientation?: StepOrientation;

	/** Navigation rules */
	navigation?: StepNavigationRules;
}

/**
 * Imperative API for controlling step navigation and state.
 * @template TId - The type of the step identifier
 */
export interface StepController<TId extends string = string> {
	/** Reactive nanostores list of all steps with runtime state */
	steps: ReadableAtom<StepRuntime<TId>[]>;

	/** Currently active step */
	current: ReadableAtom<StepRuntime<TId>>;

	/** Zero-based index of the current step */
	currentIndex: ReadableAtom<number>;

	/** Whether the current step is the last step */
	isLastStep: ReadableAtom<boolean>;

	/** Debug info store */
	debug: ReadableAtom<any>;

	/**
	 * Navigate to the next step.
	 * @returns {Promise<boolean>} True if navigation succeeded
	 */
	next(): Promise<boolean>;

	/**
	 * Navigate to the previous step.
	 * @returns {Promise<boolean>} True if navigation succeeded
	 */
	prev(): Promise<boolean>;

	/**
	 * Complete the current step but stay on it.
	 * Useful for last step async operations.
	 * Does not trigger navigation.
	 * @returns {Promise<boolean>} True if operation succeeded
	 */
	resolveCurrentStep(): Promise<boolean>;

	/**
	 * Navigate to a specific step by ID.
	 * @param id - The step ID to navigate to
	 * @returns {Promise<boolean>} True if navigation succeeded
	 */
	goTo(id: TId): Promise<boolean>;

	/**
	 * Handle successful form submission for submit steps.
	 * @returns {Promise<boolean>} True if navigation succeeded
	 */
	onSubmitSuccess(): Promise<boolean>;

	/**
	 * Set the state of a specific step. Takes precedence over computed state.
	 * @param id - The step ID
	 * @param state - The new state
	 */
	setStepState(id: TId, state: StepState): void;

	/**
	 * Clear the state override for a step, returning to computed state.
	 * @param id - The step ID
	 */
	clearStepState(id: TId): void;

	/**
	 * Mark a step as completed.
	 * @param id - The step ID to mark completed
	 */
	markCompleted(id: TId): void;

	/**
	 * Set the loading state for the controller.
	 * @param loading - Whether loading is active
	 */
	setLoading(loading: boolean): void;

	/**
	 * Reset the wizard to initial state.
	 * @param toStepId - Optional step ID to reset to
	 */
	reset(toStepId?: TId): void;

	/**
	 * Attach a Superform-like form for validation integration.
	 * @param form - The Superform-like instance
	 */
	attachFormIntegration(form: SuperFormLike<any>): void;

	/**
	 * Clean up resources used by the controller.
	 * Should be called when the controller is no longer needed.
	 */
	destroy(): void;
}

/**
 * Context passed to step rail snippet for custom rendering.
 * @template TId - The type of the step identifier
 */
export interface StepRailSnippetContext<TId extends string = string> {
	/** All steps with runtime state */
	steps: readonly StepRuntime<TId>[];

	/** Currently active step */
	current: StepRuntime<TId>;

	/** Current orientation */
	orientation: StepOrientation;

	/** Function to navigate to a specific step by ID */
	goTo: (id: TId) => Promise<boolean>;
}

/**
 * Context passed to step panel snippet for custom content rendering.
 * @template TId - The type of the step identifier
 */
export interface StepPanelSnippetContext<TId extends string = string> {
	/** The current step being displayed */
	step: StepRuntime<TId>;
	isLoading: boolean;
}

/**
 * Context passed to step actions snippet for custom navigation controls.
 * @template TId - The type of the step identifier
 */
export interface StepActionsSnippetContext<TId extends string = string> {
	/** Whether the wizard is in a loading state */
	loading: boolean;

	/** Current step runtime info */
	step: StepRuntime<TId>;

	/** Whether this is the first step */
	isFirst: boolean;

	/** Whether this is the last step */
	isLast: boolean;

	/** Whether this step triggers form submission */
	isSubmit: boolean;
}

/** * Minimal Superform-like interface for form integration.
 * @template T - Form data type
 * @template M - Form message type
 * @template In - Form input type
 */
// @ts-ignore
export type SuperFormLike<T = any, M = any> = {
	form: {
		subscribe: (
			run: Subscriber<T>,
			invalidate?: () => void
		) => Unsubscriber;

		set: (
			value: T,
			options?: { taint?: boolean | 'untaint' | 'untaint-form' }
		) => void;

		update: (
			updater: (value: T) => T,
			options?: { taint?: boolean | 'untaint' | 'untaint-form' }
		) => void;
	};

	errors: Writable<Nested<T, string[] | undefined>>;

	message: Writable<M | undefined>;

	submitting: Readable<boolean>;

	enhance: (
		el: HTMLFormElement,
		events?: Record<string, unknown>
	) => unknown;

	submit: (
		submitter?: HTMLElement | Event | EventTarget | null
	) => void;

	validateForm: (opts?: {
		update?: boolean;
	}) => Promise<{ valid: boolean }>;
};

type Nested<T, V> =
	T extends object
		? { [K in keyof T]: Nested<T[K], V> }
		: V;
