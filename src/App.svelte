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
	let currentDisplay: displays = displays.NONE;

	onMount(() => {
		ctx = canvasRef.getContext("2d");
	});
</script>

<main class="text-center h-screen py-6">
	<div class="flex flex-col gap-6">
		<h1 class="text-3xl">SIMG Convertor</h1>
		<SIMG2PNGParser bind:currentDisplay={currentDisplay} output={canvasRef} {ctx} />
		<PNG2SIMGParser bind:currentDisplay={currentDisplay} output={textareaRef} />
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
