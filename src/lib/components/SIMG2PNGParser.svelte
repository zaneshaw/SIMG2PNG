<script lang="ts">
	import ParserTemplate from "./ParserTemplate.svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	export let currentDisplay: displays;
	export let output: HTMLCanvasElement;
	$: ctx = output?.getContext("2d")
	let input: HTMLInputElement;
	let doExport: boolean;

	export function exportPNG() {
		doExport = true;
		readImage();
	}

	function readImage() {
		const file = input.files[0];
		if (file == null) return;
		
		const reader = new FileReader();
		reader.onload = (e) => {
			parseImage(e);
		};
		reader.readAsText(file);
	}
	
	function parseImage(e: ProgressEvent<FileReader>) {
		currentDisplay = displays.PNG;

		const data = e.target.result.toString();
		const arr = data
			.trim()
			.split("\r\n\r\n")
			.map((a: string) => a.split("\r\n"));
		const pixels = arr[0].map((a: string) => a.split(" ").map(Number));
		const colours = arr[1];

		const image = new RawImage(pixels, colours);
		drawImage(image, 10);
	}

	function drawImage(image: RawImage, scale: number) {
		output.width = image.dimensions.width * scale;
		output.height = image.dimensions.height * scale;
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
			link.href = output.toDataURL("image/png");
			link.click();
		}
	}

	class RawImage {
		constructor(
			public pixels: Array<Array<number>>,
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

<ParserTemplate
	bind:input
	bind:doExport
	inputLabel={"SIMG to PNG"}
	inputFileType={".simg"}
	on:click={readImage}
/>
