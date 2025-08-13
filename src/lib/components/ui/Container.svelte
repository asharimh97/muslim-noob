<script lang="ts">
	export let className = '';
</script>

<div class={`mx-auto flex w-full max-w-[500px] flex-col p-4 ${className}`}>
	<slot />
</div>
