<script lang="ts">
	import { onDestroy } from 'svelte';
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Play,
		Pause,
		Square,
		SkipForward,
		SkipBack,
		Search,
		Share2,
		BookOpen,
		Copy,
		Check,
		ArrowLeft,
		ArrowRight,
		Volume2,
		X,
		Sliders
	} from '@lucide/svelte';
	import reciters from '../../../assets/surah-reciters';
	import { MakkiyahMadaniyah } from '../../../assets/surah-info';
	import { getGlobalAyahNumber, getAudioUrl, getFallbackAudioUrl } from '$lib/utils/quran';
	import type { SurahData, SurahInfo } from '../../../assets/types';

	export let data: {
		chapter: string;
		surahData: SurahData;
		surahInfo: SurahInfo;
	};

	let search = '';
	let tafsirOpen: Record<string, boolean> = {};
	let copiedVerseKey: string | null = null;
	let toastMessage = '';
	let showSettings = false;
	let filteredVerses: [string, string][] = [];

	// Audio state

	type LoopMode = 'none' | 'verse' | 'surah';

	let audioElement: HTMLAudioElement | null = null;
	let isPlaying = false;
	let currentPlayingVerse: string | null = null;
	let selectedReciter = 'ar.alafasy';
	let playbackSpeed = 1;
	let loopMode: LoopMode = 'none';
	let audioLoading = false;
	let audioError: string | null = null;
	let useFallback = false;

	// Load preferences on mount
	if (typeof window !== 'undefined') {
		const savedReciter = localStorage.getItem('muslim-noob-reciter');
		if (savedReciter) selectedReciter = savedReciter;

		const savedSpeed = localStorage.getItem('muslim-noob-speed');
		if (savedSpeed) playbackSpeed = Number(savedSpeed);

		const savedLoop = localStorage.getItem('muslim-noob-loop');
		if (savedLoop) loopMode = savedLoop as LoopMode;
	}

	function savePreference(key: string, value: string) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(key, value);
		}
	}

	// Watch chapter changes to stop previous audio
	$: if (data.chapter) {
		stopAudio();
		tafsirOpen = {};
		search = '';
	}

	// Filter verses based on search input
	$: filteredVerses = Object.entries(data.surahData.text).filter(([key, value]) => {
		const q = search.trim().toLowerCase();
		if (!q) return true;

		const translation = data.surahData.translations.id?.text[key]?.toLowerCase() || '';
		const arabic = value;
		const verseNum = key;

		return translation.includes(q) || arabic.includes(q) || verseNum === q;
	});

	// Auto-scroll to currently playing verse
	$: if (currentPlayingVerse && typeof document !== 'undefined') {
		const el = document.getElementById(`verse-${currentPlayingVerse}`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function handleReciterChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedReciter = target.value;
		savePreference('muslim-noob-reciter', selectedReciter);
		if (isPlaying && currentPlayingVerse) {
			playVerse(currentPlayingVerse);
		}
	}

	function handleSpeedChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		playbackSpeed = Number(target.value);
		savePreference('muslim-noob-speed', String(playbackSpeed));
		if (audioElement) {
			audioElement.playbackRate = playbackSpeed;
		}
	}

	function toggleLoopMode() {
		if (loopMode === 'none') loopMode = 'verse';
		else if (loopMode === 'verse') loopMode = 'surah';
		else loopMode = 'none';
		savePreference('muslim-noob-loop', loopMode);
	}

	function stopAudio() {
		if (audioElement) {
			audioElement.pause();
			audioElement = null;
		}
		isPlaying = false;
		currentPlayingVerse = null;
		audioLoading = false;
		audioError = null;
		useFallback = false;
	}

	function playVerse(verseKey: string) {
		audioLoading = true;
		audioError = null;
		currentPlayingVerse = verseKey;

		if (audioElement) {
			audioElement.pause();
			audioElement.onended = null;
			audioElement.onerror = null;
		}

		const globalIndex = getGlobalAyahNumber(Number(data.chapter), Number(verseKey));
		const url = useFallback
			? getFallbackAudioUrl(selectedReciter, globalIndex)
			: getAudioUrl(selectedReciter, globalIndex);

		audioElement = new Audio(url);
		audioElement.playbackRate = playbackSpeed;

		audioElement.onplay = () => {
			audioLoading = false;
			isPlaying = true;
		};

		audioElement.oncanplay = () => {
			audioLoading = false;
		};

		audioElement.onended = () => {
			useFallback = false;
			if (loopMode === 'verse') {
				playVerse(verseKey);
			} else {
				const totalAyahs = Number(data.surahData.number_of_ayah);
				const nextVerseNum = Number(verseKey) + 1;
				if (nextVerseNum <= totalAyahs) {
					playVerse(String(nextVerseNum));
				} else {
					if (loopMode === 'surah') {
						playVerse('1');
					} else {
						stopAudio();
					}
				}
			}
		};

		audioElement.onerror = () => {
			if (!useFallback) {
				console.warn('Primary audio source failed, trying fallback...');
				useFallback = true;
				playVerse(verseKey);
			} else {
				console.error('All audio sources failed');
				audioLoading = false;
				isPlaying = false;
				audioError = 'Gagal memutar audio';
				useFallback = false;
			}
		};

		audioElement.play().catch((err) => {
			console.error('Audio play error:', err);
			if (!useFallback) {
				useFallback = true;
				playVerse(verseKey);
			} else {
				audioLoading = false;
				isPlaying = false;
				audioError = 'Gagal memutar audio';
				useFallback = false;
			}
		});
	}

	function togglePlayPause() {
		if (!currentPlayingVerse) {
			playVerse('1');
		} else if (isPlaying) {
			if (audioElement) {
				audioElement.pause();
			}
			isPlaying = false;
		} else {
			if (audioElement) {
				audioElement.play().catch((err) => {
					console.error(err);
				});
				isPlaying = true;
			} else {
				playVerse(currentPlayingVerse);
			}
		}
	}

	function playNextVerse() {
		if (!currentPlayingVerse) return;
		const totalAyahs = Number(data.surahData.number_of_ayah);
		const nextVerseNum = Number(currentPlayingVerse) + 1;
		if (nextVerseNum <= totalAyahs) {
			playVerse(String(nextVerseNum));
		}
	}

	function playPrevVerse() {
		if (!currentPlayingVerse) return;
		const prevVerseNum = Number(currentPlayingVerse) - 1;
		if (prevVerseNum >= 1) {
			playVerse(String(prevVerseNum));
		}
	}

	async function copyVerse(key: string, arabic: string, translation: string) {
		const textToCopy = `${arabic}\n\n${translation}\n\n(QS. ${data.surahData.name_latin} ${data.chapter}:${key})`;
		try {
			await navigator.clipboard.writeText(textToCopy);
			copiedVerseKey = key;
			showToast('Teks ayat berhasil disalin!');
			setTimeout(() => {
				copiedVerseKey = null;
			}, 2000);
		} catch (err) {
			console.error('Gagal menyalin:', err);
		}
	}

	async function shareVerse(key: string) {
		const url = `${window.location.origin}/surah/${data.chapter}/${key}`;
		const title = `QS. ${data.surahData.name_latin} ${data.chapter}:${key}`;
		const text = `Baca QS. ${data.surahData.name_latin} Ayat ${key} beserta Terjemahan dan Tafsir Kemenag.`;

		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });
			} catch (err) {
				console.log('Batal berbagi:', err);
			}
		} else {
			try {
				await navigator.clipboard.writeText(url);
				showToast('Link ayat berhasil disalin!');
			} catch (err) {
				console.error(err);
			}
		}
	}

	function showToast(msg: string) {
		toastMessage = msg;
		setTimeout(() => {
			toastMessage = '';
		}, 2000);
	}

	function highlightText(text: string, query: string): string {
		if (!query.trim()) return text;
		const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
		const regex = new RegExp(`(${escapedQuery})`, 'gi');
		return text.replace(
			regex,
			'<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">$1</mark>'
		);
	}

	onDestroy(() => {
		if (audioElement) {
			audioElement.pause();
		}
	});

	const revelation = MakkiyahMadaniyah[data.chapter];
	const currentReciter = reciters.find((r) => r.identifier === selectedReciter);
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
		rel="stylesheet"
	/>
	<MetaTag
		title={`Surah ${data.surahData.name_latin} (${data.surahData.name}) - Muslim Noob`}
		description={`Surah ${data.surahData.name_latin} (${data.surahData.name}) adalah surah ke-${data.surahInfo.current.index} dalam Al-Qur'an. Terdiri dari ${data.surahData.number_of_ayah} ayat.`}
		url={`/surah/${data.chapter}`}
	/>
</svelte:head>

<!-- Floating Toast Message -->
{#if toastMessage}
	<div
		class="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white shadow-xl transition-all duration-300"
	>
		<Check class="h-4 w-4 text-emerald-400" />
		<span>{toastMessage}</span>
	</div>
{/if}

<Container className="pb-32">
	<!-- Navigation Header -->
	<div class="mb-6 flex items-center justify-between">
		{#if data.surahInfo.prev}
			<a
				href={`/surah/${data.surahInfo.prev.index}`}
				class="flex items-center text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
			>
				<ArrowLeft class="mr-1 h-3.5 w-3.5" />
				<span>{data.surahInfo.prev.latin}</span>
			</a>
		{:else}
			<div class="w-10"></div>
		{/if}

		<a
			href="/surah"
			class="text-xs font-bold tracking-wider text-slate-500 uppercase transition hover:text-emerald-600"
		>
			Daftar Surah
		</a>

		{#if data.surahInfo.next}
			<a
				href={`/surah/${data.surahInfo.next.index}`}
				class="flex items-center text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
			>
				<span>{data.surahInfo.next.latin}</span>
				<ArrowRight class="ml-1 h-3.5 w-3.5" />
			</a>
		{:else}
			<div class="w-10"></div>
		{/if}
	</div>

	<!-- Main Surah Banner Card -->
	<Card
		className="relative overflow-hidden mb-6 border border-emerald-100 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-600/5 shadow-xl shadow-emerald-500/5"
	>
		<!-- Decorative Islamic Pattern Overlay -->
		<div
			class="pointer-events-none absolute top-0 right-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full border-[10px] border-emerald-500/5"
		></div>
		<div
			class="pointer-events-none absolute top-6 right-6 h-12 w-12 rounded-full border-2 border-emerald-500/5"
		></div>

		<div
			class="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
		>
			<div>
				<div class="mb-1 flex items-center gap-2">
					<Badge color="emerald">Surah Ke-{data.chapter}</Badge>
					<Badge color={revelation === 1 ? 'blue' : 'green'}>
						{revelation === 1 ? 'Makkiyah' : 'Madaniyah'}
					</Badge>
				</div>
				<h1 class="flex items-baseline gap-2 text-2xl font-extrabold text-slate-800 md:text-3xl">
					{data.surahData.name_latin}
					<span class="text-lg font-medium text-emerald-600"
						>({data.surahData.translations.id?.name || ''})</span
					>
				</h1>
				<p class="mt-1 text-xs text-slate-500">
					Terdiri dari <span class="font-bold text-slate-700"
						>{data.surahData.number_of_ayah} Ayat</span
					>
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<!-- Play Full Surah Button -->
				<button
					on:click={togglePlayPause}
					class="flex cursor-pointer items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
				>
					{#if isPlaying}
						<Pause class="mr-1.5 h-4 w-4 fill-current" />
						<span>Jeda</span>
					{:else}
						<Play class="mr-1.5 h-4 w-4 fill-current" />
						<span>Putar Audio</span>
					{/if}
				</button>

				<!-- Toggle settings button -->
				<button
					on:click={() => (showSettings = !showSettings)}
					class="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
					title="Pengaturan Audio"
				>
					<Sliders class="h-4 w-4" />
				</button>
			</div>
		</div>

		<!-- Expanded Settings Panel -->
		{#if showSettings}
			<div class="mt-4 grid grid-cols-1 gap-4 border-t border-emerald-100/50 pt-4 sm:grid-cols-2">
				<div class="flex flex-col gap-1">
					<label for="reciter-select" class="text-xs font-semibold text-slate-500"
						>Pilih Qori (Reciter)</label
					>
					<select
						id="reciter-select"
						value={selectedReciter}
						on:change={handleReciterChange}
						class="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
					>
						{#each reciters as reciter (reciter.identifier)}
							<option value={reciter.identifier}>{reciter.englishName} ({reciter.name})</option>
						{/each}
					</select>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div class="flex flex-col gap-1">
						<label for="speed-select" class="text-xs font-semibold text-slate-500">Kecepatan</label>
						<select
							id="speed-select"
							value={playbackSpeed}
							on:change={handleSpeedChange}
							class="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
						>
							<option value={0.5}>0.5x</option>
							<option value={0.75}>0.75x</option>
							<option value={1}>Normal</option>
							<option value={1.25}>1.25x</option>
							<option value={1.5}>1.5x</option>
							<option value={2}>2.0x</option>
						</select>
					</div>
					<div class="flex flex-col gap-1">
						<label for="loop-btn" class="text-xs font-semibold text-slate-500">Mode Ulang</label>
						<button
							id="loop-btn"
							on:click={toggleLoopMode}
							class="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
						>
							<span>
								{#if loopMode === 'none'}
									Terus (Autoplay)
								{:else}
									{loopMode === 'verse' ? 'Ulang Ayat' : 'Ulang Surah'}
								{/if}
							</span>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</Card>

	<!-- Search/Filter Input -->
	<div class="relative mb-6">
		<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			placeholder="Cari ayat berdasarkan nomor, kata terjemahan, atau text arab..."
			bind:value={search}
			class="w-full rounded-full border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all duration-300 focus:border-emerald-400 focus:ring focus:ring-emerald-100 focus:outline-none"
		/>
		{#if search}
			<button
				on:click={() => (search = '')}
				class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
			>
				<X class="h-3.5 w-3.5" />
			</button>
		{/if}
	</div>

	<!-- Results counter -->
	{#if search}
		<div class="mb-4 pl-2 text-xs font-medium text-slate-500">
			Ditemukan {filteredVerses.length} ayat yang cocok
		</div>
	{/if}

	<!-- Verses List -->
	<div class="flex flex-col gap-4">
		{#if filteredVerses.length === 0}
			<div
				class="rounded-xl border border-slate-100 bg-white py-12 text-center text-slate-400 shadow-sm"
			>
				<Search class="mx-auto mb-2 h-8 w-8 text-slate-300" />
				<p class="text-sm">Ayat yang Anda cari tidak ditemukan.</p>
			</div>
		{:else}
			{#each filteredVerses as [key, value] (key)}
				{@const isCurrentPlaying = currentPlayingVerse === key}
				{@const isTafsirOpen = tafsirOpen[key]}

				<div
					id={`verse-${key}`}
					class={`group relative rounded-xl border bg-white p-4 transition-all duration-500 sm:p-5 ${
						isCurrentPlaying
							? 'border-emerald-400 bg-emerald-50/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400'
							: 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'
					}`}
				>
					<div class="flex flex-col gap-4">
						<!-- Verse Meta Bar -->
						<div class="flex items-center justify-between">
							<!-- Verse Number Badge -->
							<a
								href={`/surah/${data.chapter}/${key}`}
								class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-100 bg-emerald-50 text-xs font-bold text-emerald-800 transition duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
								title="Buka Halaman Detail Ayat"
							>
								{key}
							</a>

							<!-- Quick Verse Action Buttons -->
							<div
								class="flex items-center gap-1 opacity-80 transition duration-300 group-hover:opacity-100 sm:opacity-0"
							>
								<!-- Play single verse -->
								<button
									on:click={() => (isCurrentPlaying && isPlaying ? stopAudio() : playVerse(key))}
									class={`cursor-pointer rounded-full p-2 transition ${
										isCurrentPlaying && isPlaying
											? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
											: 'bg-slate-50 text-slate-600 hover:bg-slate-100'
									}`}
									title={isCurrentPlaying && isPlaying ? 'Jeda' : 'Putar Ayat Ini'}
								>
									{#if isCurrentPlaying && isPlaying}
										<Pause class="h-3.5 w-3.5 fill-current" />
									{:else}
										<Play class="h-3.5 w-3.5 fill-current" />
									{/if}
								</button>

								<!-- Share -->
								<button
									on:click={() => shareVerse(key)}
									class="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
									title="Bagikan"
								>
									<Share2 class="h-3.5 w-3.5" />
								</button>

								<!-- Copy -->
								<button
									on:click={() =>
										copyVerse(key, value, data.surahData.translations.id?.text[key] || '')}
									class="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
									title="Salin Ayat"
								>
									{#if copiedVerseKey === key}
										<Check class="h-3.5 w-3.5 text-emerald-600" />
									{:else}
										<Copy class="h-3.5 w-3.5" />
									{/if}
								</button>

								<!-- Tafsir Toggle -->
								<button
									on:click={() => (tafsirOpen[key] = !isTafsirOpen)}
									class={`cursor-pointer rounded-full p-2 transition ${
										isTafsirOpen
											? 'bg-emerald-600 text-white hover:bg-emerald-700'
											: 'bg-slate-50 text-slate-600 hover:bg-slate-100'
									}`}
									title="Tafsir Ayat"
								>
									<BookOpen class="h-3.5 w-3.5" />
								</button>
							</div>
						</div>

						<!-- Arabic Text -->
						<div class="w-full py-2 text-right select-all">
							<p
								class="arabic-text text-2xl leading-[2.5] font-normal text-slate-800 antialiased sm:text-3xl"
							>
								{value}
							</p>
						</div>

						<!-- Translation -->
						<div
							class="border-t border-slate-50 pt-1 pl-1 text-sm leading-relaxed text-slate-700 select-all"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html highlightText(data.surahData.translations.id?.text[key] || '', search)}
						</div>

						<!-- Tafsir Expandable Content -->
						{#if isTafsirOpen}
							<div
								class="animate-fadeIn mt-2 rounded-lg border-l-4 border-emerald-500 bg-slate-50 p-4 transition duration-300"
							>
								<h4
									class="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase"
								>
									<BookOpen class="h-3.5 w-3.5" />
									<span>Tafsir Kemenag RI (Ayat {key})</span>
								</h4>
								<div class="space-y-3">
									{#each (data.surahData.tafsir.id?.kemenag?.text[key] || 'Tafsir tidak tersedia.').split('\n') as paragraph (paragraph)}
										{#if paragraph.trim()}
											<p
												class="text-justify text-xs leading-relaxed whitespace-pre-wrap text-slate-600 sm:text-sm"
											>
												{paragraph}
											</p>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</Container>

<!-- Bottom Floating Audio Player Bar -->
{#if currentPlayingVerse}
	<div
		class="animate-slideUp fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md dark:bg-slate-950/95"
	>
		<div class="mx-auto flex max-w-[500px] items-center justify-between gap-3">
			<!-- Left: Verse Info & Qori -->
			<div class="flex flex-1 items-center gap-2 overflow-hidden">
				<!-- Animated Visualizer Waves -->
				{#if isPlaying && !audioLoading}
					<div class="flex h-4 w-6 shrink-0 items-end gap-0.5 pl-1">
						<div class="bar-anim h-full w-0.75 origin-bottom rounded-t bg-emerald-500"></div>
						<div class="bar-anim h-full w-0.75 origin-bottom rounded-t bg-emerald-500"></div>
						<div class="bar-anim h-full w-0.75 origin-bottom rounded-t bg-emerald-500"></div>
						<div class="bar-anim h-full w-0.75 origin-bottom rounded-t bg-emerald-500"></div>
					</div>
				{:else}
					<div class="shrink-0 p-1 text-slate-400">
						<Volume2 class="h-4 w-4" />
					</div>
				{/if}

				<div class="flex min-w-0 flex-col">
					<span class="truncate text-xs font-extrabold text-slate-800 dark:text-slate-200">
						QS. {data.surahData.name_latin} [{data.chapter}]:{currentPlayingVerse}
					</span>
					<span class="truncate text-[10px] text-slate-500 dark:text-slate-400">
						Qori: {currentReciter?.englishName || 'Mishary Alafasy'}
					</span>
				</div>
			</div>

			<!-- Center: Controls -->
			<div class="flex shrink-0 items-center gap-1">
				<!-- Previous verse -->
				<button
					on:click={playPrevVerse}
					disabled={Number(currentPlayingVerse) <= 1}
					class="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800"
					title="Ayat Sebelumnya"
				>
					<SkipBack class="h-4 w-4 fill-current" />
				</button>

				<!-- Play/Pause -->
				<button
					on:click={togglePlayPause}
					class="flex cursor-pointer items-center justify-center rounded-full bg-emerald-600 p-2.5 text-white shadow-md shadow-emerald-600/10 transition hover:bg-emerald-700 active:scale-95"
				>
					{#if audioLoading}
						<!-- Loading spinner -->
						<svg
							class="h-4.5 w-4.5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{:else if isPlaying}
						<Pause class="h-4.5 w-4.5 fill-current" />
					{:else}
						<Play class="h-4.5 w-4.5 fill-current" />
					{/if}
				</button>

				<!-- Next verse -->
				<button
					on:click={playNextVerse}
					disabled={Number(currentPlayingVerse) >= Number(data.surahData.number_of_ayah)}
					class="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800"
					title="Ayat Selanjutnya"
				>
					<SkipForward class="h-4 w-4 fill-current" />
				</button>
			</div>

			<!-- Right: Stop/Close Button -->
			<div class="flex shrink-0 items-center gap-1">
				<!-- Loop Mode toggle in floating bar -->
				<button
					on:click={toggleLoopMode}
					class={`cursor-pointer rounded-full p-2 text-xs font-semibold transition ${
						loopMode !== 'none'
							? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
							: 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
					}`}
					title={`Ulang: ${loopMode === 'none' ? 'Mati' : loopMode === 'verse' ? 'Ayat' : 'Surah'}`}
				>
					{#if loopMode === 'none'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-repeat-2 opacity-50"
							><path d="m2 9 3-3 3 3" /><path d="M13 18H7a2 2 0 0 1-2-2V6" /><path
								d="m22 15-3 3-3-3"
							/><path d="M11 6h6a2 2 0 0 1 2 2v10" /></svg
						>
					{:else if loopMode === 'verse'}
						<span class="text-[10px] font-black tracking-tighter uppercase">1x</span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-repeat"
							><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path
								d="m7 22-4-4 4-4"
							/><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg
						>
					{/if}
				</button>

				<!-- Stop/Close -->
				<button
					on:click={stopAudio}
					class="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
					title="Hentikan Audio"
				>
					<Square class="h-3.5 w-3.5 fill-current" />
				</button>
			</div>
		</div>
		{#if audioError}
			<div class="mx-auto mt-1 max-w-[500px] text-center text-[10px] font-semibold text-red-500">
				{audioError}
			</div>
		{/if}
	</div>
{/if}

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: scaleY(0.3);
		}
		50% {
			transform: scaleY(1);
		}
	}
	.bar-anim {
		animation: bounce 0.8s ease-in-out infinite;
	}
	.bar-anim:nth-child(2) {
		animation-delay: 0.15s;
	}
	.bar-anim:nth-child(3) {
		animation-delay: 0.3s;
	}
	.bar-anim:nth-child(4) {
		animation-delay: 0.45s;
	}
	.arabic-text {
		font-family: 'Amiri', serif;
	}
</style>
