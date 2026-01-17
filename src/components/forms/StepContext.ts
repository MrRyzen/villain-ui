import type { StepContext } from './Stepper.types';
import { getContext } from 'svelte';

export const STEPPER_CONTEXT_KEY = Symbol('stepper-form-context');

export function getStepperContext(): StepContext | undefined {
	return getContext<StepContext>(STEPPER_CONTEXT_KEY);
}
