<script lang="ts">
	import {
		SystemConsole,
		SystemInterface,
		Heading,
		Text,
		Card,
		Grid,
		Container,
		Badge,
		CodeBlock,
		Divider,
		Button,
		Hero,
		Collapse,
		Accordion,
		Carousel,
		ScrollArea,
		Portal,
		Code
	} from '@mrintel/villain-ui';
	import type { ConsoleMessage, SystemMessage } from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const collapseCode = `import { Collapse } from '@mrintel/villain-ui';

let isOpen = $state(false);

<Collapse title="Click to expand" open={isOpen} onToggle={() => isOpen = !isOpen}>
  Content goes here...
</Collapse>

<!-- Or use it uncontrolled -->
<Collapse title="Uncontrolled collapse" open={false}>
  This manages its own state internally
</Collapse>`;

	const accordionCode = `import { Accordion } from '@mrintel/villain-ui';

const items = [
  { id: '1', title: 'Section 1', content: 'Content for section 1' },
  { id: '2', title: 'Section 2', content: 'Content for section 2' },
  { id: '3', title: 'Section 3', content: 'Content for section 3' }
];

let openItems = $state('1'); // Single mode
// let openItems = $state(['1', '2']); // Multiple mode

<Accordion items={items} bind:openItems mode="single" />
<Accordion items={items} bind:openItems mode="multiple" />`;

	const carouselCode = `import { Carousel } from '@mrintel/villain-ui';

const items = [
  { id: '1', content: 'Slide 1' },
  { id: '2', content: 'Slide 2' },
  { id: '3', content: 'Slide 3' }
];

let currentIndex = $state(0);

<Carousel
  items={items}
  bind:currentIndex
  autoplay
  autoplayInterval={3000}
  showDots
  showArrows
/>`;

	const scrollAreaCode = `import { ScrollArea } from '@mrintel/villain-ui';

<ScrollArea height="300px">
  <div class="p-4">
    ...long content here...
  </div>
</ScrollArea>`;

	const portalCode = `import { Portal } from '@mrintel/villain-ui';

let showPortal = $state(false);

<Portal>
  {#if showPortal}
    <div class="fixed top-4 right-4 p-4 bg-surface rounded-lg shadow-xl">
      This content is rendered outside the normal DOM hierarchy!
    </div>
  {/if}
</Portal>`;

	const heroCode = `import { Hero, Heading, Text, Badge } from '@mrintel/villain-ui';

<Hero>
  {#snippet title()}
    <Heading level={1} variant="accent" glow>Welcome</Heading>
  {/snippet}
  {#snippet text()}
    <Text variant="body" color="soft">
      Build stunning UIs with Villain UI
    </Text>
  {/snippet}
  {#snippet features()}
    <Badge variant="feature" hover>Feature 1</Badge>
    <Badge variant="feature" hover>Feature 2</Badge>
  {/snippet}
</Hero>`;

	const basicConsoleCode = `import { SystemConsole } from '@mrintel/villain-ui';
import type { ConsoleMessage } from '@mrintel/villain-ui';

let messages = $state<ConsoleMessage[]>([
  {
    id: '1',
    role: 'system',
    variant: 'info',
    content: 'SYSTEM ONLINE. Enter commands below.',
    timestamp: new Date()
  }
]);

function handleCommand(input: string) {
  // Add user message
  messages.push({
    id: crypto.randomUUID(),
    role: 'user',
    content: input,
    timestamp: new Date()
  });

  // Process command and respond
  const response = processCommand(input);
  messages.push({
    id: crypto.randomUUID(),
    role: 'system',
    variant: response.variant,
    content: response.message,
    timestamp: new Date()
  });
}

<SystemConsole
  messages={messages}
  onSubmit={handleCommand}
  prompt=">"
  height="400px"
/>`;

	const aiInterfaceCode = `import { SystemConsole } from '@mrintel/villain-ui';

// Simulated AI assistant
async function handleQuery(input: string) {
  // Add user query
  messages.push({
    id: crypto.randomUUID(),
    role: 'user',
    content: input,
    timestamp: new Date()
  });

  // Simulate AI processing
  messages.push({
    id: crypto.randomUUID(),
    role: 'system',
    variant: 'info',
    content: 'Processing query...',
    timestamp: new Date()
  });

  // Call API and get response
  const response = await callAI(input);
  messages.push({
    id: crypto.randomUUID(),
    role: 'system',
    content: response,
    timestamp: new Date()
  });
}

<SystemConsole
  messages={messages}
  onSubmit={handleQuery}
  prompt="AI>"
  placeholder="Ask anything..."
  typewriterEffect
  showTimestamps
/>`;

	const streamingCode = `// System can push messages independently
function startMonitoring() {
  const interval = setInterval(() => {
    messages.push({
      id: crypto.randomUUID(),
      role: 'system',
      variant: 'success',
      content: \`[MONITOR] CPU: \${Math.random() * 100}%\`,
      timestamp: new Date()
    });
  }, 2000);
}`;

	const basicInterfaceCode = `import { SystemInterface } from '@mrintel/villain-ui';
import type { SystemMessage } from '@mrintel/villain-ui';

let messages = $state<SystemMessage[]>([
  {
    id: '1',
    role: 'system',
    tier: 'directive',
    content: 'System initialized. Awaiting directives.',
    timestamp: Date.now()
  }
]);

let processing = $state(false);

async function handleSubmit(input: string) {
  // Add user message
  messages.push({
    id: crypto.randomUUID(),
    role: 'user',
    content: input,
    timestamp: Date.now()
  });

  processing = true;

  // External intelligence processes input
  const response = await processInput(input);

  // Add system response
  messages.push({
    id: crypto.randomUUID(),
    role: 'system',
    tier: response.tier,
    content: response.content,
    timestamp: Date.now()
  });

  processing = false;
}

<SystemInterface
  {messages}
  onSubmit={handleSubmit}
  {processing}
  height="600px"
/>`;

	const governanceCode = `// AI Governance System Example
const systemDirectives = {
  'analyze risk': {
    tier: 'analysis',
    response: 'Risk assessment protocol initiated. Analyzing threat vectors...'
  },
  'execute protocol': {
    tier: 'directive',
    response: 'DIRECTIVE ACCEPTED. Protocol execution sequence engaged.'
  },
  'critical alert': {
    tier: 'critical',
    response: 'CRITICAL SYSTEM ALERT. Immediate action required.'
  },
  'status check': {
    tier: 'informational',
    response: 'All systems nominal. No anomalies detected.'
  }
};

// System can autonomously push critical updates
function pushSystemAlert(tier: SystemMessage['tier'], message: string) {
  messages.push({
    id: crypto.randomUUID(),
    role: 'system',
    tier,
    content: message,
    timestamp: Date.now()
  });
}`;

	const tierSystemCode = `// Tier-Based Message System
type MessageTier = 'informational' | 'analysis' | 'directive' | 'warning' | 'critical';

// Visual tier hierarchy:
// informational - Subtle purple (routine updates)
// analysis      - Blue (data processing, insights)
// directive     - Strong purple (commands, actions)
// warning       - Amber (caution required)
// critical      - Red (urgent attention needed)

// External systems determine tier based on:
// - Message severity
// - System state
// - Decision importance
// - User authorization level`;

	const structuredDataCode = `// Structured Data Types
import type { MessageContentType } from '@mrintel/villain-ui';

// 1. RPG Stats Display
const statsMessage: SystemMessage = {
  id: crypto.randomUUID(),
  role: 'system',
  tier: 'analysis',
  content: {
    type: 'stats',
    value: {
      HP: 150,
      MP: 80,
      ATK: 45,
      DEF: 32,
      SPD: 28
    },
    layout: 'grid'  // or 'list'
  },
  timestamp: Date.now()
};

// 2. Status Indicators
const statusMessage: SystemMessage = {
  id: crypto.randomUUID(),
  role: 'system',
  content: {
    type: 'status',
    value: {
      'Strength Buff': { value: '+15 ATK', status: 'ok' },
      'Poison': { value: '-2 HP/sec', status: 'error' },
      'Mana Shield': { value: 'Active', status: 'info' }
    }
  },
  timestamp: Date.now()
};

// 3. Inventory Table
const inventoryMessage: SystemMessage = {
  id: crypto.randomUUID(),
  role: 'system',
  content: {
    type: 'table',
    value: {
      headers: ['Item', 'Quantity', 'Type'],
      rows: [
        ['Health Potion', 5, 'Consumable'],
        ['Mana Crystal', 3, 'Consumable'],
        ['Iron Sword', 1, 'Weapon']
      ]
    }
  },
  timestamp: Date.now()
};

// 4. Equipment Key-Value
const equipmentMessage: SystemMessage = {
  id: crypto.randomUUID(),
  role: 'system',
  content: {
    type: 'keyvalue',
    value: {
      'Weapon': 'Iron Sword +5',
      'Armor': 'Steel Plate',
      'Accessory': 'Ring of Protection'
    },
    columns: 1
  },
  timestamp: Date.now()
};`;

	const persistentPanelsCode = `// Persistent Info Panels (All Optional)
<SystemInterface
  {messages}
  onSubmit={handleCommand}
  height="700px"
>
  <!-- Left Panel -->
  {#snippet leftPanel()}
    <div class="space-y-3">
      <h3 class="text-xs font-bold uppercase text-accent">Left Panel</h3>
      <!-- Any content: stats, navigation, quick actions, etc. -->
    </div>
  {/snippet}

  <!-- Right Panel -->
  {#snippet rightPanel()}
    <h3 class="text-xs font-bold uppercase text-accent mb-3">Right Panel</h3>
    <!-- Any content: status, updates, filters, etc. -->
  {/snippet}

  <!-- Top Panel -->
  {#snippet topPanel()}
    <div class="text-sm">
      <!-- Any content: breadcrumbs, user info, context, etc. -->
    </div>
  {/snippet}

  <!-- Bottom Panel -->
  {#snippet bottomPanel()}
    <div>
      <!-- Any content: footer info, actions, summary, etc. -->
    </div>
  {/snippet}
</SystemInterface>`;

	// State for highlighted code
	let collapseHtml = $state('');
	let accordionHtml = $state('');
	let carouselHtml = $state('');
	let scrollAreaHtml = $state('');
	let portalHtml = $state('');
	let heroHtml = $state('');
	let basicConsoleHtml = $state('');
	let aiInterfaceHtml = $state('');
	let streamingHtml = $state('');
	let basicInterfaceHtml = $state('');
	let governanceHtml = $state('');
	let tierSystemHtml = $state('');
	let structuredDataHtml = $state('');
	let persistentPanelsHtml = $state('');

	// Collapse demo state
	let collapseOpen1 = $state(false);
	let collapseOpen2 = $state(true);

	// Accordion demo state
	const accordionItems = [
		{
			id: '1',
			title: 'What is Villain UI?',
			content:
				'Villain UI is a luxury Svelte 5 component library with a dark aesthetic, built with TypeScript and Tailwind CSS v4.'
		},
		{
			id: '2',
			title: 'How do I install it?',
			content: 'You can install Villain UI via npm: `npm install @mrintel/villain-ui`'
		},
		{
			id: '3',
			title: 'What makes it unique?',
			content:
				'Villain UI emphasizes glass morphism, depth effects, and glow-based visual emphasis to create a premium user experience.'
		}
	];
	let openAccordionItems = $state('1');
	let openAccordionItemsMultiple = $state<string[]>(['1']);

	// Carousel demo state
	const carouselItems = [
		{ id: '1', content: '🎨 Beautiful Design' },
		{ id: '2', content: '⚡ Lightning Fast' },
		{ id: '3', content: '🔧 Fully Customizable' },
		{ id: '4', content: '♿ Accessible' }
	];
	let currentCarouselIndex = $state(0);

	// Portal demo state
	let showPortalDemo = $state(false);

	// Demo 1: Basic Console
	let basicMessages = $state<ConsoleMessage[]>([
		{
			id: '1',
			role: 'system',
			variant: 'info',
			content: 'VILLAIN SYSTEM v1.0.0',
			timestamp: new Date()
		},
		{
			id: '2',
			role: 'system',
			content: 'Type "help" for available commands.',
			timestamp: new Date()
		}
	]);

	function handleBasicCommand(input: string) {
		// Add user input
		basicMessages.push({
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: new Date()
		});

		// Process command
		const cmd = input.toLowerCase().trim();
		let response: ConsoleMessage;

		if (cmd === 'help') {
			response = {
				id: crypto.randomUUID(),
				role: 'system',
				variant: 'info',
				content: `Available commands:
  help     - Show this help message
  status   - Show system status
  clear    - Clear console (not implemented in demo)
  version  - Show system version
  time     - Show current time`,
				timestamp: new Date()
			};
		} else if (cmd === 'status') {
			response = {
				id: crypto.randomUUID(),
				role: 'system',
				variant: 'success',
				content: 'All systems operational. Memory: 78% | CPU: 23% | Uptime: 142h',
				timestamp: new Date()
			};
		} else if (cmd === 'version') {
			response = {
				id: crypto.randomUUID(),
				role: 'system',
				content: 'VILLAIN SYSTEM v1.0.0 (build 2024.01.01)',
				timestamp: new Date()
			};
		} else if (cmd === 'time') {
			response = {
				id: crypto.randomUUID(),
				role: 'system',
				content: `Current time: ${new Date().toLocaleTimeString()}`,
				timestamp: new Date()
			};
		} else {
			response = {
				id: crypto.randomUUID(),
				role: 'system',
				variant: 'error',
				content: `Unknown command: "${input}". Type "help" for available commands.`,
				timestamp: new Date()
			};
		}

		basicMessages.push(response);
		basicMessages = [...basicMessages]; // Trigger reactivity
	}

	// Demo 2: AI Interface with Typewriter
	let aiMessages = $state<ConsoleMessage[]>([
		{
			id: '1',
			role: 'system',
			variant: 'info',
			content: 'AI Assistant initialized. How can I help you?',
			timestamp: new Date()
		}
	]);

	async function handleAiQuery(input: string) {
		// Add user query
		aiMessages.push({
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: new Date()
		});

		// Simulate thinking
		const thinkingId = crypto.randomUUID();
		aiMessages.push({
			id: thinkingId,
			role: 'system',
			variant: 'info',
			content: 'Analyzing query...',
			timestamp: new Date()
		});
		aiMessages = [...aiMessages];

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Remove thinking message
		aiMessages = aiMessages.filter((m) => m.id !== thinkingId);

		// Generate response based on input
		const responses = [
			'I understand your question. Based on the data, the optimal approach would be to implement a modular architecture.',
			"That's an interesting perspective. Let me analyze the implications of that approach.",
			'The system recommends proceeding with caution. Would you like a detailed risk assessment?',
			'Processing complete. The requested operation has been queued for execution.'
		];

		const response = responses[Math.floor(Math.random() * responses.length)];

		aiMessages.push({
			id: crypto.randomUUID(),
			role: 'system',
			content: response,
			timestamp: new Date()
		});
		aiMessages = [...aiMessages];
	}

	// Demo 3: System Monitoring (auto-push)
	let monitorMessages = $state<ConsoleMessage[]>([
		{
			id: '1',
			role: 'system',
			variant: 'info',
			content: 'System monitoring enabled. Updates will appear automatically.',
			timestamp: new Date()
		}
	]);

	let monitoring = $state(false);
	let monitorInterval: ReturnType<typeof setInterval> | null = null;

	// SystemInterface Demo 1: Basic Interface
	let interfaceMessages = $state<SystemMessage[]>([
		{
			id: '1',
			role: 'system',
			tier: 'directive',
			content: 'SYSTEM INTERFACE ONLINE. Awaiting authorization.',
			timestamp: Date.now()
		}
	]);
	let interfaceProcessing = $state(false);

	async function handleInterfaceSubmit(input: string) {
		// Add user input
		interfaceMessages.push({
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: Date.now()
		});

		interfaceProcessing = true;

		// Simulate processing delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Determine response tier based on input
		const lowerInput = input.toLowerCase();
		let tier: SystemMessage['tier'] = 'informational';
		let response = 'Directive acknowledged.';

		if (lowerInput.includes('analyze') || lowerInput.includes('calculate')) {
			tier = 'analysis';
			response = 'Analysis protocol initiated. Processing data streams...';
		} else if (lowerInput.includes('execute') || lowerInput.includes('activate')) {
			tier = 'directive';
			response = 'DIRECTIVE ACCEPTED. Execution sequence engaged.';
		} else if (lowerInput.includes('warning') || lowerInput.includes('caution')) {
			tier = 'warning';
			response = 'WARNING: Proceed with caution. Authorization level may be insufficient.';
		} else if (lowerInput.includes('critical') || lowerInput.includes('emergency')) {
			tier = 'critical';
			response = 'CRITICAL ALERT. Immediate action required. All systems on standby.';
		} else if (lowerInput.includes('status') || lowerInput.includes('check')) {
			tier = 'informational';
			response = 'All systems nominal. No anomalies detected.';
		}

		interfaceMessages.push({
			id: crypto.randomUUID(),
			role: 'system',
			tier,
			content: response,
			timestamp: Date.now()
		});

		interfaceProcessing = false;
		interfaceMessages = [...interfaceMessages];
	}

	// SystemInterface Demo 2: Governance System
	let governanceMessages = $state<SystemMessage[]>([
		{
			id: '1',
			role: 'system',
			tier: 'directive',
			content: 'GOVERNANCE PROTOCOL INITIALIZED. Standing by for directives.',
			timestamp: Date.now()
		}
	]);
	let governanceProcessing = $state(false);
	let autonomousActive = $state(false);
	let autonomousInterval: ReturnType<typeof setInterval> | null = null;

	async function handleGovernanceSubmit(input: string) {
		governanceMessages.push({
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: Date.now()
		});

		governanceProcessing = true;
		await new Promise((resolve) => setTimeout(resolve, 1200));

		const lowerInput = input.toLowerCase();
		const responses: Array<{ tier: SystemMessage['tier']; text: string }> = [];

		if (lowerInput.includes('scan') || lowerInput.includes('detect')) {
			responses.push({
				tier: 'analysis',
				text: 'Initiating deep system scan. Analyzing 47 subsystems...'
			});
			await new Promise((resolve) => setTimeout(resolve, 1000));
			responses.push({
				tier: 'informational',
				text: 'Scan complete. 3 anomalies detected in sectors 12, 18, 34.'
			});
		} else if (lowerInput.includes('deploy') || lowerInput.includes('launch')) {
			responses.push({
				tier: 'directive',
				text: 'DEPLOYMENT SEQUENCE INITIATED. Configuring parameters...'
			});
			await new Promise((resolve) => setTimeout(resolve, 800));
			responses.push({
				tier: 'directive',
				text: 'Systems armed. Awaiting final authorization code.'
			});
		} else if (lowerInput.includes('threat') || lowerInput.includes('breach')) {
			responses.push({
				tier: 'warning',
				text: 'SECURITY ALERT: Potential threat vector identified.'
			});
			await new Promise((resolve) => setTimeout(resolve, 600));
			responses.push({
				tier: 'critical',
				text: 'CRITICAL: Unauthorized access attempt detected. Lockdown protocols engaged.'
			});
		} else {
			responses.push({
				tier: 'informational',
				text: 'Directive processed. No immediate action required.'
			});
		}

		for (const response of responses) {
			governanceMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: response.tier,
				content: response.text,
				timestamp: Date.now()
			});
			governanceMessages = [...governanceMessages];
			if (responses.length > 1) await new Promise((resolve) => setTimeout(resolve, 400));
		}

		governanceProcessing = false;
	}

	function toggleAutonomous() {
		autonomousActive = !autonomousActive;

		if (autonomousActive) {
			const events = [
				{ tier: 'informational' as const, text: '[AUTONOMOUS] System health check complete. All nominal.' },
				{ tier: 'analysis' as const, text: '[AUTONOMOUS] Resource allocation optimized. Efficiency +12%.' },
				{ tier: 'warning' as const, text: '[AUTONOMOUS] Temperature threshold approaching in sector 7.' },
				{ tier: 'informational' as const, text: '[AUTONOMOUS] Backup sequence verified. Data integrity maintained.' },
				{ tier: 'directive' as const, text: '[AUTONOMOUS] Maintenance window scheduled for 0300 hours.' }
			];

			autonomousInterval = setInterval(() => {
				const event = events[Math.floor(Math.random() * events.length)];
				governanceMessages.push({
					id: crypto.randomUUID(),
					role: 'system',
					tier: event.tier,
					content: event.text,
					timestamp: Date.now()
				});
				governanceMessages = [...governanceMessages];
			}, 3000);
		} else {
			if (autonomousInterval) {
				clearInterval(autonomousInterval);
				autonomousInterval = null;
			}
		}
	}

	// SystemInterface Demo 3: RPG Character System
	let rpgMessages = $state<SystemMessage[]>([
		{
			id: '1',
			role: 'system',
			tier: 'directive',
			content: 'CHARACTER SYSTEM INITIALIZED. Type "help" for available commands.',
			timestamp: Date.now()
		}
	]);
	let rpgProcessing = $state(false);

	// Character stats (persistent panel data)
	let charStats = $state({
		HP: 150,
		MP: 80,
		ATK: 45,
		DEF: 32,
		SPD: 28,
		LVL: 12
	});

	// Active effects (persistent panel data)
	let activeEffects = $state([
		{ name: 'Strength Buff', color: 'var(--color-success)', duration: 120 },
		{ name: 'Regeneration', color: 'var(--color-accent)', duration: 60 }
	]);

	async function handleRpgCommand(input: string) {
		// Add user command
		rpgMessages.push({
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: Date.now()
		});

		rpgProcessing = true;
		await new Promise((resolve) => setTimeout(resolve, 600));

		const cmd = input.toLowerCase().trim();

		if (cmd === 'help') {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'informational',
				content: {
					type: 'keyvalue',
					value: {
						'stats': 'Display character statistics',
						'status': 'Show active buffs and debuffs',
						'inventory': 'View inventory contents',
						'equipment': 'Show equipped items',
						'battle': 'Simulate a battle encounter',
						'heal': 'Use a health potion'
					},
					columns: 1
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'stats') {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'analysis',
				content: {
					type: 'stats',
					value: { ...charStats },
					layout: 'grid'
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'status') {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'informational',
				content: {
					type: 'status',
					value: {
						'Strength Buff': { value: '+15 ATK | 120s remaining', status: 'ok' },
						'Regeneration': { value: '+5 HP/sec | 60s remaining', status: 'ok' },
						'Combat Ready': { value: 'All systems operational', status: 'info' }
					}
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'inventory') {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				content: {
					type: 'table',
					value: {
						headers: ['Item', 'Quantity', 'Type', 'Effect'],
						rows: [
							['Health Potion', 5, 'Consumable', '+50 HP'],
							['Mana Crystal', 3, 'Consumable', '+30 MP'],
							['Phoenix Down', 1, 'Consumable', 'Revive'],
							['Iron Sword', 1, 'Weapon', '+20 ATK'],
							['Steel Shield', 1, 'Armor', '+15 DEF']
						]
					}
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'equipment') {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				content: {
					type: 'keyvalue',
					value: {
						'Weapon': 'Vorpal Blade +5',
						'Off-Hand': 'Steel Shield',
						'Helmet': 'Knight\'s Helm',
						'Armor': 'Mithril Plate',
						'Boots': 'Boots of Speed',
						'Accessory 1': 'Ring of Protection',
						'Accessory 2': 'Amulet of Mana'
					},
					columns: 2
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'battle') {
			// Simulate multi-message battle sequence
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'directive',
				content: 'BATTLE INITIATED. Shadow Beast appears!',
				timestamp: Date.now()
			});
			rpgMessages = [...rpgMessages];
			await new Promise((resolve) => setTimeout(resolve, 800));

			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'analysis',
				content: {
					type: 'stats',
					value: {
						'Enemy HP': 200,
						'Enemy ATK': 38,
						'Enemy DEF': 25
					},
					layout: 'list'
				},
				timestamp: Date.now()
			});
			rpgMessages = [...rpgMessages];
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Update character stats (damage taken)
			charStats.HP -= 25;
			charStats = { ...charStats };

			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'warning',
				content: 'Shadow Beast attacks! You take 25 damage.',
				timestamp: Date.now()
			});
			rpgMessages = [...rpgMessages];
			await new Promise((resolve) => setTimeout(resolve, 600));

			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'directive',
				content: 'You counter-attack with Vorpal Blade! Critical hit for 85 damage!',
				timestamp: Date.now()
			});
			rpgMessages = [...rpgMessages];
			await new Promise((resolve) => setTimeout(resolve, 600));

			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'informational',
				content: {
					type: 'status',
					value: {
						'Battle Status': { value: 'Victory!', status: 'ok' },
						'Experience Gained': { value: '+450 XP', status: 'info' },
						'Loot Acquired': { value: 'Shadow Essence', status: 'ok' }
					}
				},
				timestamp: Date.now()
			});
		} else if (cmd === 'heal') {
			const healAmount = 50;
			charStats.HP = Math.min(charStats.HP + healAmount, 150);
			charStats = { ...charStats };

			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'informational',
				content: `Used Health Potion. Restored ${healAmount} HP.`,
				timestamp: Date.now()
			});

			// Add poison effect
			activeEffects.push({ name: 'Poison Resist', color: 'var(--color-warning)', duration: 30 });
			activeEffects = [...activeEffects];
		} else {
			rpgMessages.push({
				id: crypto.randomUUID(),
				role: 'system',
				tier: 'warning',
				content: `Unknown command: "${input}". Type "help" for available commands.`,
				timestamp: Date.now()
			});
		}

		rpgProcessing = false;
		rpgMessages = [...rpgMessages];
	}

	function toggleMonitoring() {
		monitoring = !monitoring;

		if (monitoring) {
			monitorInterval = setInterval(() => {
				const metrics = [
					{ label: 'CPU', value: (Math.random() * 100).toFixed(1), unit: '%' },
					{ label: 'MEM', value: (Math.random() * 100).toFixed(1), unit: '%' },
					{ label: 'NET', value: (Math.random() * 1000).toFixed(0), unit: 'KB/s' }
				];

				const metric = metrics[Math.floor(Math.random() * metrics.length)];
				const variant = parseFloat(metric.value) > 80 ? 'warning' : 'success';

				monitorMessages.push({
					id: crypto.randomUUID(),
					role: 'system',
					variant: variant as any,
					content: `[MONITOR] ${metric.label}: ${metric.value}${metric.unit}`,
					timestamp: new Date()
				});
				monitorMessages = [...monitorMessages];
			}, 2000);
		} else {
			if (monitorInterval) {
				clearInterval(monitorInterval);
				monitorInterval = null;
			}
		}
	}

	onMount(async () => {
		collapseHtml = await codeToHtml(collapseCode, { lang: 'svelte', theme: 'github-dark' });
		accordionHtml = await codeToHtml(accordionCode, { lang: 'svelte', theme: 'github-dark' });
		carouselHtml = await codeToHtml(carouselCode, { lang: 'svelte', theme: 'github-dark' });
		scrollAreaHtml = await codeToHtml(scrollAreaCode, { lang: 'svelte', theme: 'github-dark' });
		portalHtml = await codeToHtml(portalCode, { lang: 'svelte', theme: 'github-dark' });
		heroHtml = await codeToHtml(heroCode, { lang: 'svelte', theme: 'github-dark' });
		basicConsoleHtml = await codeToHtml(basicConsoleCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
		aiInterfaceHtml = await codeToHtml(aiInterfaceCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
		streamingHtml = await codeToHtml(streamingCode, { lang: 'typescript', theme: 'github-dark' });
		basicInterfaceHtml = await codeToHtml(basicInterfaceCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
		governanceHtml = await codeToHtml(governanceCode, {
			lang: 'typescript',
			theme: 'github-dark'
		});
		tierSystemHtml = await codeToHtml(tierSystemCode, {
			lang: 'typescript',
			theme: 'github-dark'
		});
		structuredDataHtml = await codeToHtml(structuredDataCode, {
			lang: 'typescript',
			theme: 'github-dark'
		});
		persistentPanelsHtml = await codeToHtml(persistentPanelsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
	});

	onDestroy(() => {
		if (monitorInterval) clearInterval(monitorInterval);
		if (autonomousInterval) clearInterval(autonomousInterval);
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Utility Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Powerful utility components for layout, interaction, and advanced UI patterns
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layers" class="tag-icon" />
				Collapse & Accordion
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:gallery-horizontal" class="tag-icon" />
				Carousel
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:scroll-text" class="tag-icon" />
				Scroll Area
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:terminal-square" class="tag-icon" />
				System Console
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:cpu" class="tag-icon" />
				System Interface
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Collapse -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Collapse</Heading>
				<Text variant="body" color="soft">Expandable content sections with smooth animations</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Controlled Collapse</Text>
					<Collapse
						title="What is Villain UI?"
						open={collapseOpen1}
						onToggle={() => (collapseOpen1 = !collapseOpen1)}
					>
						<Text variant="body" color="soft">
							Villain UI is a luxury Svelte 5 component library with a dark aesthetic, featuring
							glass morphism, depth effects, and glow-based visual emphasis.
						</Text>
					</Collapse>
				</div>

				<div>
					<Text variant="caption" color="soft">Uncontrolled Collapse (initially open)</Text>
					<Collapse title="Installation Instructions" open={collapseOpen2}>
						<div class="space-y-2">
							<Text variant="body" color="soft">Install via npm:</Text>
							<code class="block bg-base-2 p-3 rounded-md text-accent">
								npm install @mrintel/villain-ui
							</code>
						</div>
					</Collapse>
				</div>

				<CodeBlock
					filename="Collapse.svelte"
					showLineNumbers
					lineCount={collapseCode.split('\n').length}
					showCopy
					code={collapseCode}
				>
					{@html collapseHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Accordion -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Accordion</Heading>
				<Text variant="body" color="soft">
					Group multiple collapse sections with single or multiple open modes
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Single Mode (only one open at a time)</Text>
					<Accordion items={accordionItems} bind:openItems={openAccordionItems} mode="single" />
				</div>

				<div>
					<Text variant="caption" color="soft">Multiple Mode (multiple can be open)</Text>
					<Accordion
						items={accordionItems}
						bind:openItems={openAccordionItemsMultiple}
						mode="multiple"
					/>
				</div>

				<CodeBlock
					filename="Accordion.svelte"
					showLineNumbers
					lineCount={accordionCode.split('\n').length}
					showCopy
					code={accordionCode}
				>
					{@html accordionHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Carousel -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Carousel</Heading>
				<Text variant="body" color="soft">
					Image or content carousel with autoplay and touch support
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Interactive Carousel with Autoplay</Text>
					<Carousel
						items={carouselItems}
						bind:currentIndex={currentCarouselIndex}
						autoplay
						autoplayInterval={3000}
						showDots
						showArrows
					/>
					<Text variant="caption" color="muted">
						Currently showing slide {currentCarouselIndex + 1} of {carouselItems.length}
					</Text>
				</div>
				<CodeBlock
					filename="Carousel.svelte"
					showLineNumbers
					lineCount={carouselCode.split('\n').length}
					showCopy
					code={carouselCode}
				>
					{@html carouselHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- ScrollArea -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Scroll Area</Heading>
				<Text variant="body" color="soft">
					Custom styled scrollable container with themed scrollbars
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Scrollable Content (300px height)</Text>
					<ScrollArea height="300px">
						<div class="p-4 space-y-3">
							{#each Array(20) as _, i}
								<div class="p-3 bg-base-2 rounded-md border border-border">
									<Text variant="body" color="soft">Scrollable Item {i + 1}</Text>
								</div>
							{/each}
						</div>
					</ScrollArea>
				</div>

				<CodeBlock
					filename="ScrollArea.svelte"
					showLineNumbers
					lineCount={scrollAreaCode.split('\n').length}
					showCopy
					code={scrollAreaCode}
				>
					{@html scrollAreaHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Portal -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Portal</Heading>
				<Text variant="body" color="soft">Render content outside the normal DOM hierarchy</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div>
					<Text variant="caption" color="soft">Portal Demo</Text>
					<Text variant="body" color="soft">
						The Portal component allows you to render content outside the normal component tree,
						useful for modals, tooltips, and overlays that need to escape parent overflow or z-index
						constraints.
					</Text>
					<div
						class="p-4 bg-base-2 rounded-md border border-border overflow-hidden"
						style="position: relative; z-index: 1;"
					>
						<Text variant="body">This container has overflow:hidden and z-index:1</Text>
						<Button variant="primary" onclick={() => (showPortalDemo = !showPortalDemo)}>
							{showPortalDemo ? 'Hide' : 'Show'} Portal Content
						</Button>
					</div>
				</div>

				<CodeBlock
					filename="Portal.svelte"
					showLineNumbers
					lineCount={portalCode.split('\n').length}
					showCopy
					code={portalCode}
				>
					{@html portalHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Hero -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Hero Component</Heading>
				<Text variant="body" color="soft">
					Page header section with title, description, and feature tags
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<div class="border border-border rounded-lg overflow-hidden">
					<Hero>
						{#snippet title()}
							<Heading level={2} variant="accent" glow>Example Hero Section</Heading>
						{/snippet}
						{#snippet text()}
							<Text variant="body" color="soft">
								This is what a hero section looks like. Use it at the top of your pages to create a
								strong visual introduction.
							</Text>
						{/snippet}
						{#snippet features()}
							<Badge variant="feature" size="md" hover>
								<Icon icon="lucide:sparkles" class="tag-icon" />
								Feature 1
							</Badge>
							<Badge variant="feature" size="md" hover>
								<Icon icon="lucide:zap" class="tag-icon" />
								Feature 2
							</Badge>
							<Badge variant="feature" size="md" hover>
								<Icon icon="lucide:star" class="tag-icon" />
								Feature 3
							</Badge>
						{/snippet}
					</Hero>
				</div>

				<CodeBlock
					filename="Hero.svelte"
					showLineNumbers
					lineCount={heroCode.split('\n').length}
					showCopy
					code={heroCode}
				>
					{@html heroHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Divider />

		<!-- System Console -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>System Console</Heading>
				<Text variant="body" color="soft">
					A retro-futuristic system console for building AI interfaces, command systems, and
					interactive terminals.
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<!-- Basic Console -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Basic Command Console</Text>
						<Text variant="caption" color="muted">Try: help, status, version, time</Text>
					</div>
					<SystemConsole
						messages={basicMessages}
						onSubmit={handleBasicCommand}
						prompt=">"
						placeholder="Enter command..."
						height="350px"
						showTimestamps
					/>
				</div>

				<!-- AI Interface -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">AI Assistant with Typewriter Effect</Text>
						<Text variant="caption" color="muted">Ask any question and watch the AI respond</Text>
					</div>
					<SystemConsole
						messages={aiMessages}
						onSubmit={handleAiQuery}
						prompt="AI>"
						placeholder="Ask anything..."
						height="400px"
						typewriterEffect
						typewriterSpeed={60}
						showTimestamps
						glowEffect
					/>
				</div>

				<!-- System Monitoring -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">System Monitoring (Auto-Push Messages)</Text>
						<Text variant="caption" color="muted">External system pushes updates independently</Text
						>
					</div>
					<div class="mb-3">
						<Button variant="primary" size="sm" onclick={toggleMonitoring}>
							{monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
						</Button>
					</div>
					<SystemConsole
						messages={monitorMessages}
						prompt="SYS>"
						placeholder="Enter command..."
						height="300px"
						showTimestamps
						disabled={monitoring}
					/>
				</div>

				<!-- Minimal Console -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Minimal Console (No Effects)</Text>
					</div>
					<SystemConsole
						messages={[
							{
								id: '1',
								role: 'system',
								content: 'Minimal console initialized.',
								timestamp: new Date()
							}
						]}
						onSubmit={(input) => console.log('Command:', input)}
						prompt="$"
						height="200px"
						showScanlines={false}
						glowEffect={false}
					/>
				</div>
				<CodeBlock
					filename="BasicConsole.svelte"
					showLineNumbers
					lineCount={basicConsoleCode.split('\n').length}
					showCopy
					code={basicConsoleCode}
				>
					{@html basicConsoleHtml}
				</CodeBlock>

				<CodeBlock
					filename="AIInterface.svelte"
					showLineNumbers
					lineCount={aiInterfaceCode.split('\n').length}
					showCopy
					code={aiInterfaceCode}
				>
					{@html aiInterfaceHtml}
				</CodeBlock>

				<CodeBlock
					filename="SystemStreaming.ts"
					showLineNumbers
					lineCount={streamingCode.split('\n').length}
					showCopy
					code={streamingCode}
				>
					{@html streamingHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Divider />

		<!-- System Interface -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>System Interface</Heading>
				<Text variant="body" color="soft">
					A high-fidelity, futuristic system interface representing an advanced governing
					intelligence. Designed for authority, precision, and aesthetic restraint.
				</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<!-- Tier Explanation -->
				<div class="p-4 bg-base-2 border border-border rounded-lg">
					<Heading level={4}>Tier-Based Message System</Heading>
					<Grid cols={2} gap="md">
						<div>
							<Badge variant="accent" size="sm" class="mb-2">
								<span style="color: var(--color-accent-soft);">●</span> INFORMATIONAL
							</Badge>
							<Text variant="caption" color="soft">Routine updates and status reports</Text>
						</div>
						<div>
							<Badge variant="accent" size="sm" class="mb-2">
								<span style="color: #60a5fa;">●</span> ANALYSIS
							</Badge>
							<Text variant="caption" color="soft">Data processing and insights</Text>
						</div>
						<div>
							<Badge variant="accent" size="sm" class="mb-2">
								<span style="color: var(--color-accent);">●</span> DIRECTIVE
							</Badge>
							<Text variant="caption" color="soft">Commands and system actions</Text>
						</div>
						<div>
							<Badge variant="accent" size="sm" class="mb-2">
								<span style="color: var(--color-warning);">●</span> WARNING
							</Badge>
							<Text variant="caption" color="soft">Caution and risk alerts</Text>
						</div>
						<div>
							<Badge variant="accent" size="sm" class="mb-2">
								<span style="color: var(--color-error);">●</span> CRITICAL
							</Badge>
							<Text variant="caption" color="soft">Urgent attention required</Text>
						</div>
					</Grid>
				</div>

				<!-- Demo 1: Basic Interface -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Basic System Interface</Text>
						<Text variant="caption" color="muted">
							Try: "analyze data", "execute protocol", "status check", "critical alert"
						</Text>
					</div>
					<SystemInterface
						messages={interfaceMessages}
						onSubmit={handleInterfaceSubmit}
						processing={interfaceProcessing}
						height="500px"
					/>
				</div>

				<!-- Demo 2: Governance System -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">AI Governance System</Text>
						<Text variant="caption" color="muted">
							Try: "scan systems", "deploy defenses", "threat detected"
						</Text>
					</div>
					<div class="mb-3">
						<Button variant="primary" size="sm" onclick={toggleAutonomous}>
							{autonomousActive ? 'Stop Autonomous Updates' : 'Enable Autonomous Updates'}
						</Button>
						<Text variant="caption" color="muted">
							System will push updates independently every 3s
						</Text>
					</div>
					<SystemInterface
						messages={governanceMessages}
						onSubmit={handleGovernanceSubmit}
						processing={governanceProcessing}
						height="550px"
						stagingDelay={200}
					/>
				</div>

				<!-- Demo 3: RPG Character System -->
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft"
							>RPG Character System (Structured Data Showcase)</Text
						>
						<Text variant="caption" color="muted">
							Try: "help", "stats", "status", "inventory", "equipment", "battle", "heal"
						</Text>
					</div>
					<SystemInterface
						messages={rpgMessages}
						onSubmit={handleRpgCommand}
						processing={rpgProcessing}
						height="600px"
					>
						{#snippet leftPanel()}
							<div class="space-y-2">
								<div
									class="text-[0.65rem] font-bold uppercase tracking-wider"
									style="color: var(--color-accent-soft);"
								>
									Character Stats
								</div>
								{#each Object.entries(charStats) as [stat, value]}
									<div
										class="flex justify-between p-2 rounded"
										style="background: rgba(0,0,0,0.3); border: 1px solid var(--color-border);"
									>
										<span class="text-[0.65rem] uppercase tracking-wide opacity-70">{stat}</span>
										<span class="text-sm font-bold" style="color: var(--color-accent);"
											>{value}</span
										>
									</div>
								{/each}
							</div>
						{/snippet}

						{#snippet rightPanel()}
							<div class="space-y-2">
								<div
									class="text-[0.65rem] font-bold uppercase tracking-wider mb-3"
									style="color: var(--color-accent-soft);"
								>
									Active Effects
								</div>
								{#each activeEffects as effect}
									<div
										class="flex items-center gap-2 p-2 rounded"
										style="background: rgba(0,0,0,0.2);"
									>
										<span
											class="w-2 h-2 rounded-full flex-shrink-0"
											style="background: {effect.color}; box-shadow: 0 0 8px {effect.color};"
										></span>
										<div class="flex-1">
											<div class="text-[0.7rem] font-medium">{effect.name}</div>
											<div class="text-[0.6rem] opacity-60">{effect.duration}s</div>
										</div>
									</div>
								{/each}
							</div>
						{/snippet}
					</SystemInterface>
				</div>

				<!-- Code Examples -->
				<CodeBlock
					filename="BasicInterface.svelte"
					showLineNumbers
					lineCount={basicInterfaceCode.split('\n').length}
					showCopy
					code={basicInterfaceCode}
				>
					{@html basicInterfaceHtml}
				</CodeBlock>

				<CodeBlock
					filename="GovernanceSystem.ts"
					showLineNumbers
					lineCount={governanceCode.split('\n').length}
					showCopy
					code={governanceCode}
				>
					{@html governanceHtml}
				</CodeBlock>

				<CodeBlock
					filename="TierSystem.ts"
					showLineNumbers
					lineCount={tierSystemCode.split('\n').length}
					showCopy
					code={tierSystemCode}
				>
					{@html tierSystemHtml}
				</CodeBlock>

				<CodeBlock
					filename="StructuredData.ts"
					showLineNumbers
					lineCount={structuredDataCode.split('\n').length}
					showCopy
					code={structuredDataCode}
				>
					{@html structuredDataHtml}
				</CodeBlock>

				<CodeBlock
					filename="PersistentPanels.svelte"
					showLineNumbers
					lineCount={persistentPanelsCode.split('\n').length}
					showCopy
					code={persistentPanelsCode}
				>
					{@html persistentPanelsHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Usage Tips -->
		<Card padding="lg" class="accent-surface">
			{#snippet header()}
				<Heading level={2}>Usage Tips</Heading>
			{/snippet}

			<Grid cols={2} gap="lg">
				<div>
					<Heading level={4}>Collapse vs Accordion</Heading>
					<Text variant="body" color="soft">
						Use <Code>Collapse</Code> for single expandable sections. Use
						<Code>Accordion</Code> when you have multiple related sections that should coordinate their
						open/close state.
					</Text>
				</div>

				<div>
					<Heading level={4}>Carousel Touch Support</Heading>
					<Text variant="body" color="soft">
						The Carousel component supports touch gestures on mobile devices. Swipe left or right to
						navigate between slides.
					</Text>
				</div>

				<div>
					<Heading level={4}>ScrollArea Customization</Heading>
					<Text variant="body" color="soft">
						ScrollArea uses themed scrollbars that match your design system. Adjust the height prop
						to control the visible area.
					</Text>
				</div>

				<div>
					<Heading level={4}>SystemConsole Architecture</Heading>
					<Text variant="body" color="soft">
						The SystemConsole separates concerns: it handles display while you handle logic. This
						makes it perfect for AI assistants, monitoring dashboards, or command interfaces.
					</Text>
				</div>

				<div>
					<Heading level={4}>SystemInterface vs SystemConsole</Heading>
					<Text variant="body" color="soft">
						Use <Code>SystemInterface</Code> for governing intelligence UIs with tier-based authority.
						Use <Code>SystemConsole</Code> for retro terminal aesthetics with CRT effects. Both support
						autonomous message pushing.
					</Text>
				</div>

				<div>
					<Heading level={4}>Tier-Based Messaging</Heading>
					<Text variant="body" color="soft">
						SystemInterface uses 5 visual tiers to communicate message importance. External systems
						determine the tier based on severity, state, and decision importance.
					</Text>
				</div>

				<div>
					<Heading level={4}>Hero Placement</Heading>
					<Text variant="body" color="soft">
						Place the Hero component at the top of your pages for a strong visual introduction. All
						snippets (title, text, features) are optional.
					</Text>
				</div>

				<div>
					<Heading level={4}>Portal Component</Heading>
					<Text variant="body" color="soft">
						The Portal component is available for advanced use cases where you need to render
						content outside the normal DOM hierarchy. It's used internally by Modal and Drawer.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<!-- Portal Demo Instance -->
<Portal>
	{#if showPortalDemo}
		<div
			class="fixed top-4 right-4 p-4 bg-surface rounded-lg shadow-xl border border-border z-[9999] max-w-sm"
		>
			<div class="flex items-start justify-between mb-2">
				<Heading level={4}>Portal Content!</Heading>
				<Button variant="ghost" size="sm" onclick={() => (showPortalDemo = false)}>
					<Icon icon="lucide:x" width="16" height="16" />
				</Button>
			</div>
			<Text variant="body" color="soft">
				This content is rendered outside the normal DOM hierarchy using Portal, so it escapes any
				parent overflow or z-index constraints.
			</Text>
		</div>
	{/if}
</Portal>

<style>
	.section-label {
		display: block;
		margin-bottom: 0.75rem;
	}
</style>
