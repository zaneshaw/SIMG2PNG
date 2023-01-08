<script lang="ts">
	import { createEventDispatcher } from "svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	const dispatch = createEventDispatcher();
	export let currentDisplay: displays;
	export let output: HTMLTextAreaElement;
	let inputEl: HTMLInputElement;

	function readImage(doExport: boolean = false) {
		const file = inputEl.files[0];
		if (file == null) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			parseImage(e, doExport);
		};
		reader.readAsDataURL(file);
	}

	function parseImage(e: ProgressEvent<FileReader>, doExport: boolean) {
		currentDisplay = displays.SIMG;

		const image: HTMLImageElement = new Image();
		image.onload = function () {
			const canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;

			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			ctx.drawImage(image, 0, 0);

			const pixels = new Array(image.height)
				.fill(0)
				.map(() => new Array(image.width).fill(0));
			const colours = [];
			for (let y = 0; y < image.height; y++) {
				for (let x = 0; x < image.width; x++) {
					const data = ctx.getImageData(x, y, 1, 1).data;

					const colour = `${data[0]} ${data[1]} ${data[2]}`;
					if (!colours.includes(colour)) colours.push(colour);

					pixels[y][x] = colours.indexOf(colour);
				}
			}
			const parsedPixels = pixels.map((x) => x.join(" ")).join("\r\n");
			const parsedColours = colours.join("\r\n");
			const parsedImage = `${parsedPixels}\r\n\r\n${parsedColours}`;

			output.value = parsedImage;

			if (doExport) {
				const dateString = new Date()
					.toLocaleString()
					.replace(", ", "-")
					.replace(" ", "");

				exportImage(parsedImage, `ExportedPNG_${dateString}`);
			}
		};
		image.src = e.target.result.toString();
	}

	function exportImage(content: string, name: string) {
		const a = document.createElement("a");
		const file = new Blob([content], { type: "text/plain" });

		a.href = URL.createObjectURL(file);
		a.download = `${name}.simg`;
		a.click();

		URL.revokeObjectURL(a.href);
	}
</script>

<div class="flex justify-center">
	<div class="flex flex-col gap-1 items-end">
		<div class="form-control w-72">
			<label for="fileinput" class="label">
				<span class="label-text">PNG to SIMG</span>
				<span class="label-text-alt">.PNG</span>
			</label>
			<input
				type="file"
				accept=".png"
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
