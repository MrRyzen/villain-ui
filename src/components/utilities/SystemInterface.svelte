<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SystemMessage, MessageContentType } from './utilities.types';

	interface Props {
		messages: SystemMessage[];
		onSubmit?: (input: string) => void;
		processing?: boolean;
		placeholder?: string;
		height?: string;
		autoScroll?: boolean;
		stagingDelay?: number;

		// Slots for persistent areas
		leftPanel?: Snippet;
		rightPanel?: Snippet;
		topPanel?: Snippet;
		bottomPanel?: Snippet;

		class?: string;
	}

	let {
		messages = [],
		onSubmit,
		processing = false,
		placeholder = 'ENTER DIRECTIVE',
		height = '600px',
		autoScroll = true,
		stagingDelay = 150,
		leftPanel,
		rightPanel,
		topPanel,
		bottomPanel,
		class: className = '',
		...restProps
	}: Props = $props();

	let inputValue = $state('');
	let outputContainer: HTMLDivElement | undefined = $state();
	let inputElement: HTMLInputElement | undefined = $state();
	let visibleMessages = $state<Set<string>>(new Set());
	let processingDots = $state(0);

	// Auto-scroll when messages change
	$effect(() => {
		if (autoScroll && outputContainer && messages.length > 0) {
			requestAnimationFrame(() => {
				if (outputContainer) {
					outputContainer.scrollTop = outputContainer.scrollHeight;
				}
			});
		}
	});

	// Staged message revelation
	$effect(() => {
		const newMessages = messages.filter((m) => !visibleMessages.has(m.id));

		if (newMessages.length === 0) return;

		// Stage messages with delay
		newMessages.forEach((msg, index) => {
			setTimeout(
				() => {
					visibleMessages.add(msg.id);
					visibleMessages = new Set(visibleMessages);
				},
				index * stagingDelay
			);
		});
	});

	// Processing animation
	$effect(() => {
		if (!processing) {
			processingDots = 0;
			return;
		}

		const interval = setInterval(() => {
			processingDots = (processingDots + 1) % 4;
		}, 400);

		return () => clearInterval(interval);
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (!trimmed || !onSubmit || processing) return;

		onSubmit(trimmed);
		inputValue = '';
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey && !processing) {
			e.preventDefault();
			handleSubmit(e);
		}
	}

	function getTierStyles(tier?: SystemMessage['tier']) {
		const tiers = {
			informational:
				'text-[var(--color-accent-soft)] border-l-[var(--color-accent-overlay-30)]',
			analysis: 'text-[#60a5fa] border-l-[rgba(96,165,250,0.3)]',
			directive: 'text-[var(--color-accent)] border-l-[var(--color-accent-overlay-50)]',
			warning: 'text-[var(--color-warning)] border-l-[rgba(251,191,36,0.3)]',
			critical: 'text-[var(--color-error)] border-l-[var(--color-error-overlay-50)]'
		};
		return tier ? tiers[tier] : tiers.informational;
	}

	function formatTimestamp(ts?: number): string {
		if (!ts) return '';
		const date = new Date(ts);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const ms = date.getMilliseconds().toString().padStart(3, '0');
		return `${hours}:${minutes}:${seconds}.${ms}`;
	}

	function getContent(content: string | MessageContentType): MessageContentType {
		if (typeof content === 'string') {
			return { type: 'text', value: content };
		}
		return content;
	}

	function getStatusColor(status: 'ok' | 'warning' | 'error' | 'info') {
		const colors = {
			ok: 'var(--color-success)',
			warning: 'var(--color-warning)',
			error: 'var(--color-error)',
			info: 'var(--color-accent)'
		};
		return colors[status];
	}

	const containerStyle = $derived(`height: ${height}`);
	const hasPanel = $derived(!!leftPanel || !!rightPanel || !!topPanel || !!bottomPanel);
</script>

<div
	class="system-interface {className}"
	class:has-panels={hasPanel}
	style={containerStyle}
	{...restProps}
	role="log"
	aria-live="polite"
	aria-atomic="false"
>
	<!-- Header -->
	<div class="interface-header">
		<div class="header-line"></div>
		<div class="header-title">
			<span class="title-text">SYSTEM INTERFACE</span>
			{#if processing}
				<span class="processing-indicator">
					PROCESSING{'.'.repeat(processingDots)}
				</span>
			{/if}
		</div>
		<div class="header-line"></div>
	</div>

	<!-- Top Panel (optional persistent area) -->
	{#if topPanel}
		<div class="top-panel">
			{@render topPanel()}
		</div>
	{/if}

	<!-- Main Content Area -->
	<div class="interface-content">
		<!-- Left Panel (optional) -->
		{#if leftPanel}
			<div class="side-panel left-panel">
				{@render leftPanel()}
			</div>
		{/if}

		<!-- Message Stream -->
		<div class="message-stream" bind:this={outputContainer}>
			{#each messages as message (message.id)}
				{@const isVisible = visibleMessages.has(message.id)}
				{@const contentData = getContent(message.content)}
				<div
					class="message-wrapper"
					class:visible={isVisible}
					class:updateable={message.updateable}
					data-role={message.role}
					data-tier={message.tier}
					data-type={contentData.type}
				>
					{#if message.role === 'user'}
						<!-- User Input -->
						<div class="user-message">
							<div class="message-meta">
								<span class="message-role">USER</span>
								{#if message.timestamp}
									<span class="message-timestamp">{formatTimestamp(message.timestamp)}</span>
								{/if}
							</div>
							<div class="message-content user-content">
								{#if contentData.type === 'text'}
									{contentData.value}
								{:else if typeof message.content === 'string'}
									{message.content}
								{/if}
							</div>
						</div>
					{:else}
						<!-- System Output -->
						<div class="system-message {getTierStyles(message.tier)}">
							<div class="message-meta">
								<span class="message-role">SYSTEM</span>
								{#if message.tier}
									<span class="tier-indicator">{message.tier.toUpperCase()}</span>
								{/if}
								<span class="content-type">{contentData.type.toUpperCase()}</span>
								{#if message.timestamp}
									<span class="message-timestamp">{formatTimestamp(message.timestamp)}</span>
								{/if}
							</div>
							<div class="message-content system-content">
								{#if contentData.type === 'text'}
									<div class="text-content">{contentData.value}</div>
								{:else if contentData.type === 'stats'}
									<div class="stats-content" class:grid-layout={contentData.layout === 'grid'}>
										{#each Object.entries(contentData.value) as [key, value]}
											<div class="stat-item">
												<span class="stat-label">{key}</span>
												<span class="stat-value">{value}</span>
											</div>
										{/each}
									</div>
								{:else if contentData.type === 'status'}
									<div class="status-content">
										{#each Object.entries(contentData.value) as [key, { value, status }]}
											<div class="status-item">
												<span class="status-indicator" style="background: {getStatusColor(status)}"></span>
												<span class="status-label">{key}</span>
												<span class="status-value">{value}</span>
											</div>
										{/each}
									</div>
								{:else if contentData.type === 'table'}
									<div class="table-content">
										<table>
											<thead>
												<tr>
													{#each contentData.value.headers as header}
														<th>{header}</th>
													{/each}
												</tr>
											</thead>
											<tbody>
												{#each contentData.value.rows as row}
													<tr>
														{#each row as cell}
															<td>{cell}</td>
														{/each}
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								{:else if contentData.type === 'keyvalue'}
									<div class="keyvalue-content" style="grid-template-columns: repeat({contentData.columns || 2}, 1fr)">
										{#each Object.entries(contentData.value) as [key, value]}
											<div class="kv-item">
												<span class="kv-key">{key}:</span>
												<span class="kv-value">{value}</span>
											</div>
										{/each}
									</div>
								{:else if contentData.type === 'custom'}
									<div class="custom-content {contentData.class || ''}">
										{contentData.value}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Right Panel (optional) -->
		{#if rightPanel}
			<div class="side-panel right-panel">
				{@render rightPanel()}
			</div>
		{/if}
	</div>

	<!-- Bottom Panel (optional) -->
	{#if bottomPanel}
		<div class="bottom-panel">
			{@render bottomPanel()}
		</div>
	{/if}

	<!-- Input Area -->
	<form class="input-area" onsubmit={handleSubmit}>
		<div class="input-wrapper">
			<span class="input-prompt">›</span>
			<input
				bind:this={inputElement}
				bind:value={inputValue}
				type="text"
				class="system-input"
				placeholder={processing ? 'AWAITING SYSTEM RESPONSE' : placeholder}
				disabled={processing}
				onkeydown={handleKeyDown}
				autocomplete="off"
				spellcheck="false"
			/>
			<button
				type="submit"
				class="submit-indicator"
				disabled={!inputValue.trim() || processing}
				aria-label="Submit"
			>
				<span class="submit-icon">→</span>
			</button>
		</div>
	</form>
</div>

<style>
	.system-interface {
		display: flex;
		flex-direction: column;
		background: linear-gradient(
			180deg,
			rgba(10, 10, 12, 0.98) 0%,
			rgba(5, 5, 8, 0.98) 100%
		);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		font-family: var(--font-mono);
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.02),
			0 20px 60px rgba(0, 0, 0, 0.9),
			inset 0 1px 0 rgba(255, 255, 255, 0.03);
		position: relative;
		backdrop-filter: blur(20px);
	}

	/* Header */
	.interface-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(
			180deg,
			rgba(15, 15, 20, 0.8) 0%,
			rgba(10, 10, 15, 0.6) 100%
		);
		border-bottom: 1px solid var(--color-border);
		position: relative;
	}

	.header-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color-accent-overlay-20) 50%,
			transparent 100%
		);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		font-weight: 600;
	}

	.title-text {
		color: var(--color-accent-soft);
		text-shadow: 0 0 20px var(--color-accent-overlay-30);
	}

	.processing-indicator {
		color: var(--color-accent);
		font-size: 0.625rem;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		min-width: 5rem;
		text-align: left;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	/* Top Panel */
	.top-panel {
		padding: 1rem 1.5rem;
		background: rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid var(--color-border);
	}

	/* Content Area with optional side panels */
	.interface-content {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.side-panel {
		width: 250px;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.left-panel {
		border-right: 1px solid var(--color-border);
	}

	.right-panel {
		border-left: 1px solid var(--color-border);
	}

	/* Bottom Panel */
	.bottom-panel {
		padding: 1rem 1.5rem;
		background: rgba(0, 0, 0, 0.2);
		border-top: 1px solid var(--color-border);
	}

	/* Message Stream */
	.message-stream {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.3);
		position: relative;
	}

	.message-wrapper {
		margin-bottom: 1.5rem;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.4s var(--ease-luxe),
			transform 0.4s var(--ease-luxe);
	}

	.message-wrapper.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.message-wrapper.updateable {
		/* Messages that can be updated in place might have different styling */
		position: relative;
	}

	/* Message Meta */
	.message-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
		font-size: 0.625rem;
		letter-spacing: 0.1em;
	}

	.message-role {
		color: var(--color-text-muted);
		font-weight: 600;
	}

	.tier-indicator,
	.content-type {
		color: var(--color-accent-soft);
		opacity: 0.6;
		font-size: 0.55rem;
	}

	.message-timestamp {
		color: var(--color-text-muted);
		opacity: 0.4;
		margin-left: auto;
	}

	/* User Messages */
	.user-message {
		max-width: 80%;
	}

	.user-content {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		color: var(--color-text);
		line-height: 1.6;
		font-size: var(--text-sm);
	}

	/* System Messages */
	.system-message {
		border-left: 2px solid;
		padding-left: 1rem;
		transition: all 0.3s var(--ease-luxe);
	}

	.system-content {
		color: inherit;
		line-height: 1.7;
		font-size: var(--text-sm);
	}

	/* Content Type Renderers */
	.text-content {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.stats-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.stats-content.grid-layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.stat-label {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.6;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		text-shadow: 0 0 20px currentColor;
	}

	.status-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-sm);
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		box-shadow: 0 0 10px currentColor;
		flex-shrink: 0;
	}

	.status-label {
		flex: 1;
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.status-value {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.table-content {
		overflow-x: auto;
	}

	.table-content table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
	}

	.table-content th {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.625rem;
		opacity: 0.8;
	}

	.table-content td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.keyvalue-content {
		display: grid;
		gap: 0.5rem;
	}

	.kv-item {
		display: flex;
		gap: 0.5rem;
		padding: 0.375rem 0.5rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
	}

	.kv-key {
		opacity: 0.7;
		font-weight: 600;
	}

	.kv-value {
		flex: 1;
	}

	.custom-content {
		/* Allow custom styling via class */
	}

	/* Input Area */
	.input-area {
		background: linear-gradient(
			180deg,
			rgba(10, 10, 15, 0.6) 0%,
			rgba(15, 15, 20, 0.8) 100%
		);
		border-top: 1px solid var(--color-border);
		padding: 1rem 1.5rem;
		position: relative;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		transition: all 0.3s var(--ease-luxe);
	}

	.input-wrapper:focus-within {
		border-color: var(--color-accent-overlay-50);
		box-shadow: 0 0 20px var(--color-accent-overlay-20);
	}

	.input-prompt {
		color: var(--color-accent);
		font-size: 1rem;
		font-weight: 700;
		user-select: none;
		text-shadow: 0 0 10px currentColor;
		flex-shrink: 0;
	}

	.system-input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--color-text);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		outline: none;
		letter-spacing: 0.02em;
		caret-color: var(--color-accent);
	}

	.system-input::placeholder {
		color: var(--color-text-muted);
		opacity: 0.3;
		letter-spacing: 0.05em;
		font-size: 0.75rem;
	}

	.system-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.submit-indicator {
		background: transparent;
		border: none;
		color: var(--color-accent-soft);
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0;
		transition: all 0.3s var(--ease-luxe);
		opacity: 0.3;
		flex-shrink: 0;
	}

	.submit-indicator:not(:disabled) {
		opacity: 1;
	}

	.submit-indicator:not(:disabled):hover {
		color: var(--color-accent);
		text-shadow: 0 0 12px currentColor;
		transform: translateX(2px);
	}

	.submit-indicator:disabled {
		cursor: not-allowed;
		opacity: 0.2;
	}

	.submit-icon {
		display: block;
		line-height: 1;
	}

	/* Scrollbar */
	.message-stream::-webkit-scrollbar,
	.side-panel::-webkit-scrollbar {
		width: 0.375rem;
	}

	.message-stream::-webkit-scrollbar-track,
	.side-panel::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.4);
	}

	.message-stream::-webkit-scrollbar-thumb,
	.side-panel::-webkit-scrollbar-thumb {
		background: var(--color-accent-overlay-20);
		border-radius: var(--radius-sm);
		transition: background 0.3s var(--ease-luxe);
	}

	.message-stream::-webkit-scrollbar-thumb:hover,
	.side-panel::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-overlay-40);
	}
</style>
