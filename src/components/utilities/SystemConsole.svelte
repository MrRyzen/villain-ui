<script lang="ts">
	import type { ConsoleMessage } from './utilities.types';

	interface Props {
		messages: ConsoleMessage[];
		prompt?: string; // System prompt prefix (e.g., '>', 'SYSTEM:', 'λ')
		placeholder?: string;
		height?: string;
		maxHeight?: string;
		showTimestamps?: boolean;
		autoScroll?: boolean;
		typewriterEffect?: boolean; // Animate system messages
		typewriterSpeed?: number; // Characters per second
		showScanlines?: boolean;
		glowEffect?: boolean;
		onSubmit?: (input: string) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		messages = [],
		prompt = '>',
		placeholder = 'Enter command...',
		height = '500px',
		maxHeight = '80vh',
		showTimestamps = false,
		autoScroll = true,
		typewriterEffect = false,
		typewriterSpeed = 50,
		showScanlines = true,
		glowEffect = true,
		onSubmit,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputValue = $state('');
	let consoleContainer: HTMLDivElement | undefined = $state();
	let inputElement: HTMLInputElement | undefined = $state();

	// Typewriter state
	let displayedMessages = $state<Map<string, string>>(new Map());

	// Scroll to bottom when messages change
	$effect(() => {
		if (autoScroll && consoleContainer && messages.length > 0) {
			setTimeout(() => {
				if (consoleContainer) {
					consoleContainer.scrollTop = consoleContainer.scrollHeight;
				}
			}, 0);
		}
	});

	// Typewriter effect for system messages
	$effect(() => {
		if (!typewriterEffect) {
			// No animation, show all messages immediately
			displayedMessages = new Map(messages.map(m => [m.id, m.content]));
			return;
		}

		messages.forEach(message => {
			if (message.role === 'user') {
				// User messages appear instantly
				displayedMessages.set(message.id, message.content);
			} else {
				// System messages get typewriter effect
				const currentContent = displayedMessages.get(message.id) || '';
				if (currentContent.length < message.content.length) {
					const interval = setInterval(() => {
						const current = displayedMessages.get(message.id) || '';
						if (current.length < message.content.length) {
							displayedMessages.set(message.id, message.content.slice(0, current.length + 1));
							displayedMessages = new Map(displayedMessages);
						} else {
							clearInterval(interval);
						}
					}, 1000 / typewriterSpeed);
					return () => clearInterval(interval);
				}
			}
		});
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (!trimmed || !onSubmit) return;

		onSubmit(trimmed);
		inputValue = '';
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}

	function getVariantClass(variant?: string) {
		const variants = {
			default: 'text-[var(--color-text-soft)]',
			success: 'text-[var(--color-success)]',
			warning: 'text-[var(--color-warning)]',
			error: 'text-[var(--color-error)]',
			info: 'text-[var(--color-accent)]'
		};
		return variant ? variants[variant as keyof typeof variants] : variants.default;
	}

	function formatTimestamp(date?: Date) {
		if (!date) return '';
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	const containerStyle = $derived(() => {
		const styles: string[] = [];
		if (height) styles.push(`height: ${height}`);
		if (maxHeight && !height) styles.push(`max-height: ${maxHeight}`);
		return styles.join('; ');
	});
</script>

<div
	class="system-console {className}"
	class:scanlines={showScanlines}
	class:glow={glowEffect}
	style={containerStyle()}
	{...restProps}
>
	<!-- Message Display Area -->
	<div class="console-output" bind:this={consoleContainer}>
		{#each messages as message (message.id)}
			<div class="console-message" class:user-message={message.role === 'user'}>
				{#if showTimestamps && message.timestamp}
					<span class="timestamp">[{formatTimestamp(message.timestamp)}]</span>
				{/if}

				{#if message.role === 'user'}
					<span class="user-prompt">{prompt}</span>
					<span class="user-input">{displayedMessages.get(message.id) || message.content}</span>
				{:else}
					<span class="system-output {getVariantClass(message.variant)}">
						{displayedMessages.get(message.id) || message.content}
					</span>
					{#if typewriterEffect && (displayedMessages.get(message.id)?.length || 0) < message.content.length}
						<span class="cursor">▋</span>
					{/if}
				{/if}
			</div>
		{/each}
	</div>

	<!-- Input Area -->
	<form class="console-input-wrapper" onsubmit={handleSubmit}>
		<span class="input-prompt">{prompt}</span>
		<input
			bind:this={inputElement}
			bind:value={inputValue}
			type="text"
			class="console-input"
			{placeholder}
			{disabled}
			onkeydown={handleKeyDown}
			autocomplete="off"
			spellcheck="false"
		/>
	</form>
</div>

<style>
	.system-console {
		display: flex;
		flex-direction: column;
		background: #000000;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-family: var(--font-mono);
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.03),
			0 8px 32px rgba(0, 0, 0, 0.8),
			inset 0 0 80px rgba(0, 0, 0, 0.6);
		position: relative;
	}

	/* CRT Glow Effect */
	.system-console.glow {
		box-shadow:
			0 0 0 1px var(--color-accent-overlay-20),
			0 0 20px var(--color-accent-overlay-10),
			0 8px 32px rgba(0, 0, 0, 0.8),
			inset 0 0 80px rgba(0, 0, 0, 0.6);
	}

	/* Scanline Effect */
	.system-console.scanlines::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		z-index: 10;
	}

	.console-output {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		overflow-x: hidden;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
		position: relative;
		z-index: 1;
	}

	.console-message {
		margin-bottom: 0.75rem;
		font-size: var(--text-sm);
		line-height: 1.6;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		word-wrap: break-word;
		white-space: pre-wrap;
	}

	.timestamp {
		color: var(--color-text-muted);
		opacity: 0.5;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.user-prompt,
	.input-prompt {
		color: var(--color-accent);
		margin-right: 0.5rem;
		user-select: none;
		flex-shrink: 0;
		text-shadow: 0 0 10px currentColor;
	}

	.user-input {
		color: var(--color-text);
		flex: 1;
	}

	.system-output {
		flex: 1;
		color: var(--color-text-soft);
	}

	.cursor {
		color: var(--color-accent);
		animation: blink 1s step-end infinite;
		margin-left: 0.125rem;
		text-shadow: 0 0 8px currentColor;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		50.1%,
		100% {
			opacity: 0;
		}
	}

	/* Input Area */
	.console-input-wrapper {
		display: flex;
		align-items: center;
		padding: 1rem 1.5rem;
		background: rgba(0, 0, 0, 0.5);
		border-top: 1px solid var(--color-border);
		position: relative;
		z-index: 5;
	}

	.console-input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		outline: none;
		caret-color: var(--color-accent);
	}

	.console-input::placeholder {
		color: var(--color-text-muted);
		opacity: 0.3;
	}

	.console-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Scrollbar */
	.console-output::-webkit-scrollbar {
		width: 0.5rem;
	}

	.console-output::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.5);
	}

	.console-output::-webkit-scrollbar-thumb {
		background: var(--color-accent-overlay-30);
		border-radius: var(--radius-sm);
	}

	.console-output::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-overlay-50);
	}

	/* CRT Flicker Effect (subtle) */
	@keyframes flicker {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.97;
		}
	}

	.system-console.glow {
		animation: flicker 0.15s infinite;
	}
</style>
