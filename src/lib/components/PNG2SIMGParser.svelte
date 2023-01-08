<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import ParserTemplate from "./ParserTemplate.svelte";

	enum displays {
		NONE,
		SIMG,
		PNG,
	}

	export let currentDisplay: displays;
	export let output: HTMLTextAreaElement;
	let input: HTMLInputElement;
	let doExport: boolean;

	function readImage() {
		const file = input.files[0];
		if (file == null) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			parseImage(e);
		};
		reader.readAsDataURL(file);
	}

	function parseImage(e: ProgressEvent<FileReader>) {
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

<ParserTemplate
	bind:input
	bind:doExport
	inputLabel={"PNG to SIMG"}
	inputFileType={".png"}
	on:click={readImage}
/>
