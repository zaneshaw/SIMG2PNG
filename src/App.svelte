<script lang="ts">
	import SIMG2PNGParser from "./lib/components/SIMG2PNGParser.svelte";
	import PNG2SIMGParser from "./lib/components/PNG2SIMGParser.svelte";
	import { tick } from "svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	let textareaRef: HTMLTextAreaElement;
	let canvasRef: HTMLCanvasElement;
	let currentDisplay: displays = displays.NONE;
</script>

<main class="text-center h-screen py-6 flex flex-col gap-6">
	<h1 class="text-3xl">SIMG Convertor</h1>
	<div>
		<div class="flex flex-col gap-6 {!currentDisplay ? 'block' : 'hidden'}">
			<SIMG2PNGParser bind:currentDisplay output={canvasRef} />
			<PNG2SIMGParser bind:currentDisplay output={textareaRef} />
		</div>
		<div
			class="
				flex items-center justify-center
				{currentDisplay ? 'flex' : 'hidden'}
			"
		>
			<div class="flex flex-col items-end gap-1">
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
				<button
					class="btn btn-sm w-fit"
					on:click={() => {
						currentDisplay = displays.NONE;
					}}
				>
					Convert again
				</button>
			</div>
		</div>
	</div>
</main>
