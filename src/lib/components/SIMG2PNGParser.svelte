<script lang="ts">
	import { createEventDispatcher } from "svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	const dispatch = createEventDispatcher();
	export let currentDisplay: displays;
	let inputEl: HTMLInputElement;

	function readImage(doExport: boolean = false) {
		const file = inputEl.files[0];
		if (file == null) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			parseImage(e, doExport);
		};
		reader.readAsText(file);
	}

	function parseImage(e: ProgressEvent<FileReader>, doExport: boolean) {
		currentDisplay = displays.PNG;

		const data = e.target.result.toString();
		const arr = data
			.trim()
			.split("\r\n\r\n")
			.map((a: string) => a.split("\r\n"));
		const pixels = arr[0].map((a: string) => a.split(" "));
		const colours = arr[1];

		const image = new RawImage(pixels, colours);
		dispatch("drawImage", {
			image: image,
			scale: 10,
			doExport: doExport,
		});
	}

	class RawImage {
		constructor(
			public pixels: Array<Array<string>>,
			public colours: Array<string>
		) {
			this.pixels = pixels;
			this.colours = colours;
		}

		get dimensions() {
			return {
				width: Math.max(...this.pixels.map((a) => a.length)),
				height: this.pixels.length,
			};
		}

		scaledDimensions(scale: number) {
			const dimensions = this.dimensions;
			return {
				width: dimensions.width * scale,
				height: dimensions.height * scale,
			};
		}
	}
</script>

<div class="flex justify-center">
	<div class="flex flex-col gap-1 items-end">
		<div class="form-control w-72">
			<label for="fileinput" class="label">
				<span class="label-text">SIMG to PNG</span>
				<span class="label-text-alt">.SIMG</span>
			</label>
			<input
				type="file"
				accept=".simg"
				id="fileinput"
				class="file-input file-input-md file-input-bordered"
				bind:this={inputEl}
			/>
		</div>
		<div class="flex gap-1">
			<button
				class="btn btn-sm btn-info"
				on:click={() => {
					readImage();
				}}
			>
				Parse
			</button>
			<button
				class="btn btn-sm"
				on:click={() => {
					readImage(true);
				}}>Parse + Export</button
			>
		</div>
	</div>
</div>
