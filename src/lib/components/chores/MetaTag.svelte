<script lang="ts">
	import { META_TAGS } from '$lib/constants/meta';

	interface Props {
		title?: string;
		description?: string;
		url?: string;
	}

	let {
		title = META_TAGS.TITLE,
		description = META_TAGS.DESCRIPTION,
		url = META_TAGS.HOST
	}: Props = $props();

	const imageUrl = `${META_TAGS.HOST}/images`;
</script>

<title>{title}</title>
<meta name="description" content={description} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:image" content={`${imageUrl}/meta-image.png`} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={`${imageUrl}/meta-image.png`} />
<meta name="twitter:url" content={url} />

<!-- Favicon and App Icons -->
<link rel="apple-touch-icon" sizes="57x57" href={`${imageUrl}/apple-icon-57x57.png`} />
<link rel="apple-touch-icon" sizes="60x60" href={`${imageUrl}/apple-icon-60x60.png`} />
<link rel="apple-touch-icon" sizes="72x72" href={`${imageUrl}/apple-icon-72x72.png`} />
<link rel="apple-touch-icon" sizes="76x76" href={`${imageUrl}/apple-icon-76x76.png`} />
<link rel="apple-touch-icon" sizes="114x114" href={`${imageUrl}/apple-icon-114x114.png`} />
<link rel="apple-touch-icon" sizes="120x120" href={`${imageUrl}/apple-icon-120x120.png`} />
<link rel="apple-touch-icon" sizes="144x144" href={`${imageUrl}/apple-icon-144x144.png`} />
<link rel="apple-touch-icon" sizes="152x152" href={`${imageUrl}/apple-icon-152x152.png`} />
<link rel="apple-touch-icon" sizes="180x180" href={`${imageUrl}/apple-icon-180x180.png`} />
<link rel="icon" type="image/png" sizes="192x192" href={`${imageUrl}/android-icon-192x192.png`} />
<link rel="icon" type="image/png" sizes="32x32" href={`${imageUrl}/favicon-32x32.png`} />
<link rel="icon" type="image/png" sizes="96x96" href={`${imageUrl}/favicon-96x96.png`} />
<link rel="icon" type="image/png" sizes="16x16" href={`${imageUrl}/favicon-16x16.png`} />
<link rel="manifest" href={`${imageUrl}/manifest.json`} />
<meta name="msapplication-TileColor" content="#ffffff" />
<meta name="msapplication-TileImage" content={`${imageUrl}/ms-icon-144x144.png`} />
<meta name="theme-color" content="#ffffff" />
