<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let color:
		| 'gray'
		| 'blue'
		| 'green'
		| 'red'
		| 'yellow'
		| 'purple'
		| 'pink'
		| 'orange'
		| 'teal'
		| 'indigo'
		| 'violet'
		| 'fuchsia'
		| 'rose' = 'gray';

	const colorToClasses: Record<string, { bg: string; text: string }> = {
		gray: { bg: 'bg-gray-100', text: 'text-gray-500' },
		blue: { bg: 'bg-blue-100', text: 'text-blue-500' },
		green: { bg: 'bg-green-100', text: 'text-green-500' },
		red: { bg: 'bg-red-100', text: 'text-red-500' },
		yellow: { bg: 'bg-yellow-100', text: 'text-yellow-500' },
		purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
		pink: { bg: 'bg-pink-100', text: 'text-pink-500' },
		orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
		teal: { bg: 'bg-teal-100', text: 'text-teal-500' },
		indigo: { bg: 'bg-indigo-100', text: 'text-indigo-500' },
		violet: { bg: 'bg-violet-100', text: 'text-violet-500' },
		fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-500' },
		rose: { bg: 'bg-rose-100', text: 'text-rose-500' }
	};

	const bgColor = (colorToClasses[color]?.bg as string) ?? 'bg-gray-100';
	const textColor = (colorToClasses[color]?.text as string) ?? 'text-gray-500';
</script>

<span class={twMerge(`rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500`, bgColor, textColor)}>
	<slot />
</span>
