<script lang="ts">
	import { onMount } from "svelte";

	let textareaRef: HTMLTextAreaElement;
	let canvasRef: HTMLCanvasElement;
	let simgFileRef: HTMLInputElement;
	let pngFileRef: HTMLInputElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvasRef.getContext("2d");
	});

	function readSIMG(doExport: boolean = false) {
		const file = simgFileRef.files[0];
		if (file == null) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			SIMG2PNG(e, doExport);
		};
		reader.readAsText(file);
	}

	function readPNG(doExport: boolean = false) {
		const file = pngFileRef.files[0];
		if (file == null) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			PNG2SIMG(e, doExport);
		};
		reader.readAsDataURL(file);
	}

	function SIMG2PNG(e, doExport) {
		textareaRef.style.display = "none";
		canvasRef.style.display = "block";

		const data = e.target.result;
		const rawImage: Array<Array<string>> = (() => {
			const arr = data
				.trim()
				.split("\r\n\r\n")
				.map((a: string) => a.split("\r\n"));
			arr[0] = arr[0].map((a: string) => a.split(" "));
			arr[1] = arr[1];
			return arr;
		})();

		const image = new RawImage(rawImage[0], rawImage[1]);
		drawImage(image, 10, doExport);
	}

	function PNG2SIMG(e, doExport) {
		canvasRef.style.display = "none";
		textareaRef.style.display = "block";

		const image = new Image();
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

			textareaRef.value = parsedImage;

			if (doExport)
				exportSIMG(
					parsedImage,
					`ExportedPNG_${new Date().toLocaleString()}`
				);
		};
		image.src = e.target.result;
	}

	function exportSIMG(content, name) {
		const a = document.createElement("a");
		const file = new Blob([content], { type: "text/plain" });

		a.href = URL.createObjectURL(file);
		a.download = `${name}.simg`;
		a.click();

		URL.revokeObjectURL(a.href);
	}

	function exportPNG(content, name) {
		let link = document.createElement("a");
		link.download = `${name}.png`;
		link.href = content;
		link.click();
	}

	function drawImage(image, scale, doExport) {
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

		const dateString = new Date()
			.toLocaleString()
			.replace(", ", "-")
			.replace(" ", "");
		if (doExport)
			exportPNG(
				canvasRef.toDataURL("image/png"),
				`ExportedSIMG_${dateString}`
			);
	}

	class RawImage {
		constructor(
			public pixels: Array<string>,
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

		scaledDimensions(scale) {
			const dimensions = this.dimensions;
			return {
				width: dimensions.width * scale,
				height: dimensions.height * scale,
			};
		}
	}
</script>

<main>
	<div style="display: flex; flex-direction: column; gap: 25px">
		<div>
			<label for="simgfile">SIMG to PNG:</label>
			<input
				type="file"
				id="simgfile"
				accept=".simg"
				bind:this={simgFileRef}
			/>
			<br />
			<button
				on:click={() => {
					readSIMG();
				}}
			>
				Parse
			</button>
			<button
				on:click={() => {
					readSIMG(true);
				}}>Parse + Export</button
			>
		</div>
		<div>
			<label for="pngfile">PNG to SIMG:</label>
			<input
				type="file"
				id="pngfile"
				accept=".png"
				bind:this={pngFileRef}
			/>
			<br />
			<button
				on:click={() => {
					readPNG();
				}}>Parse</button
			>
			<button
				on:click={() => {
					readPNG(true);
				}}>Parse + Export</button
			>
		</div>
	</div>

	<div
		style="
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			"
	>
		<textarea
			rows="20"
			cols="71"
			style="box-sizing: border-box; resize: none; display: none;"
			bind:this={textareaRef}
		/>
		<canvas style="display: none" bind:this={canvasRef} />
	</div>
</main>
