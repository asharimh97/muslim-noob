<script lang="ts">
	import { page } from '$app/stores';
	$: chapter = $page.params.chapter;
	$: verse = $page.params.verse;
</script>

<h1>Surah {chapter}, Verse {verse}</h1>
<p>This is the page for Surah {chapter}, Verse {verse}.</p>
