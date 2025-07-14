<script lang="ts">
	export let className = '';
</script>

<div class={`mx-auto flex w-[450px] flex-col p-4 ${className}`}>
	<slot />
</div>
