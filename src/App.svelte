<script lang="ts">
	import SIMG2PNGParser from "./lib/components/SIMG2PNGParser.svelte";
	import PNG2SIMGParser from "./lib/components/PNG2SIMGParser.svelte";
	import { onMount } from "svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	let textareaRef: HTMLTextAreaElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let currentDisplay: displays = displays.PNG; // Scuffed way of doing this (initialising as PNG in order to expose el for binding)

	onMount(() => {
		ctx = canvasRef.getContext("2d");
		currentDisplay = displays.NONE;
	});

	function drawImage(e) {
		const { image, scale, doExport } = e.detail;

		canvasRef.width = image.dimensions.width * scale;
		canvasRef.height = image.dimensions.height * scale;
		for (let y = 0; y < image.dimensions.height; y++) {
			for (let x = 0; x < image.dimensions.width; x++) {
				const colour = image.colours[image.pixels[y][x]];
				ctx.fillStyle =
					colour == null ? "transparent" : `rgb(${colour})`;
				ctx.fillRect(x * scale, y * scale, scale, scale);
			}
		}

		if (doExport) {
			const dateString = new Date()
				.toLocaleString()
				.replace(", ", "-")
				.replace(" ", "");

			let link = document.createElement("a");
			link.download = `ExportedSIMG_${dateString}.png`;
			link.href = canvasRef.toDataURL("image/png");
			link.click();
		}
	}
</script>

<main class="text-center h-screen py-6">
	<div class="flex flex-col gap-6">
		<h1 class="text-3xl">SIMG Convertor</h1>
		<SIMG2PNGParser on:drawImage={drawImage} bind:currentDisplay={currentDisplay} />
		<PNG2SIMGParser on:drawImage={drawImage} bind:currentDisplay={currentDisplay} output={textareaRef} />
	</div>

	<div
		class="absolute min-h-[20rem] bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center"
	>
		<textarea
			rows="10"
			cols="71"
			readonly
			class="
				textarea textarea-bordered resize-none
				{currentDisplay == displays.SIMG ? 'block' : 'hidden'}
			"
			bind:this={textareaRef}
		/>
		<canvas
			class="
				border border-[#a6adba] border-opacity-20 p-4 rounded-lg
				{currentDisplay == displays.PNG ? 'block' : 'hidden'}
			"
			bind:this={canvasRef}
		/>
	</div>
</main>
