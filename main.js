const textareaRef = document.getElementById("textarea");
const canvasRef = document.getElementById("canvas");
const ctx = canvasRef.getContext("2d");

function readSIMG(doExport = false) {
	const file = document.getElementById("simgfile").files[0];
	if (file == null) return;

	const reader = new FileReader(doExport);
	reader.onload = (e) => {
		parseSIMG(e, doExport);
	};
	reader.readAsText(file);
}

function readPNG(doExport = false) {
	const file = document.getElementById("pngfile").files[0];
	if (file == null) return;

	const reader = new FileReader();
	reader.onload = (e) => {
		parsePNG(e, doExport);
	};
	reader.readAsDataURL(file);
}

function parseSIMG(e, doExport) {
	textareaRef.style.display = "none";
	canvasRef.style.display = "block";

	const data = e.target.result;
	const rawImage = (() => {
		const arr = data
			.trim()
			.split("\r\n\r\n")
			.map((a) => a.split("\r\n"));
		arr[0] = arr[0].map((a) => a.split(" "));
		return arr;
	})();

	const image = new RawImage(...rawImage);
	drawImage(image, 10);
	if (doExport) console.log("exporting...");
}

function parsePNG(e, doExport) {
	canvasRef.style.display = "none";
	textareaRef.style.display = "block";

	const image = new Image();
	image.onload = function () {
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		ctx.drawImage(image, 0, 0);

		// TODO: Re-export sample SIMGs as they are using an outdouted method (y first => x first)
		const pixels = new Array(image.height).fill(0).map(() => new Array(image.width).fill(0));
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
	};
	image.src = e.target.result;

	if (doExport) console.log("exporting...");
}

function drawImage(image, scale) {
	canvasRef.width = image.dimensions.width * scale;
	canvasRef.height = image.dimensions.height * scale;
	for (let y = 0; y < image.dimensions.height; y++) {
		for (let x = 0; x < image.dimensions.width; x++) {
			const colour = image.colours[image.pixels[y][x]];
			ctx.fillStyle = colour == null ? "transparent" : `rgb(${colour})`;
			ctx.fillRect(x * scale, y * scale, scale, scale);
		}
	}
}

class RawImage {
	constructor(pixels, colours) {
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
