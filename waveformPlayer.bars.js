function WFPInstanceBars(optionsInput) {
	if (typeof optionsInput.container.tagName !== "string" || typeof optionsInput.waveformPlayer.getAudioLength !== "function") {
		throw new TypeError("A reference to a WaveformPlayer must be included in the options.");
	}
	var options = {
		container: optionsInput.container,
		waveformPlayer: optionsInput.waveformPlayer,
		height: 16,
		granularity: 1024,
		color: "black",
		clipping: {
			exists: true,
			color: "red",
			inertia: 8
		},
		leftText: "L",
		rightText: "R",
		textColor: "white",
		font: "inherit",
		margin: {
			top: 2,
			internal: 1,
			bottom: 2
		}
	};
	if (typeof optionsInput.height === typeof options.height) {
		options.height = optionsInput.height;
	}
	if (typeof optionsInput.granularity === typeof options.granularity) {
		options.granularity = optionsInput.granularity;
	}
	if (typeof optionsInput.color === typeof options.color) {
		options.color = optionsInput.color;
	}
	if (typeof optionsInput.clipping !== "undefined") {
		if (typeof optionsInput.clipping.exists == typeof options.clipping.exists) {
			options.clipping.exists = optionsInput.clipping.exists;
		}
		if (typeof optionsInput.clipping.color == typeof options.clipping.color) {
			options.clipping.color = optionsInput.clipping.color;
		}
		if (typeof optionsInput.clipping.inertia == typeof options.clipping.inertia) {
			options.clipping.inertia = optionsInput.clipping.inertia;
		}
	}
	if (typeof optionsInput.textColor === typeof options.textColor) {
		options.textColor = optionsInput.textColor;
	}
	if (typeof optionsInput.font === typeof options.font) {
		options.font = optionsInput.font;
	}
	if (typeof optionsInput.margin !== "undefined") {
		if (typeof optionsInput.margin.top === typeof options.margin.top) {
			options.margin.top = optionsInput.margin.top;
		}
		if (typeof optionsInput.margin.internal === typeof options.margin.internal) {
			options.margin.internal = optionsInput.margin.internal;
		}
		if (typeof optionsInput.margin.bottom === typeof options.margin.bottom) {
			options.margin.bottom = optionsInput.margin.bottom;
		}
	}

	options.container.style.marginTop = options.margin.top+"px";
	options.container.style.marginBottom = options.margin.bottom+"px";
	var bars = {
		left: {
			ele: null,
			clipped: false,
			inertia: 0
		},
		right: {
			ele: null,
			clipped: false,
			inertia: 0
		}
	};
	bars.left.ele = createBar(options.leftText);
	var padding = document.createElement("div");
	padding.style.height = options.margin.internal+"px";
	options.container.appendChild(padding);
	bars.right.ele = createBar(options.rightText);
	var defaultSize = Math.max(bars.left.ele.offsetWidth,bars.right.ele.offsetWidth) + 2;
	var sizeMultiplier = options.container.offsetWidth - defaultSize;
	renderZero();

	function createBar(textContent) {
		var b = document.createElement("div");
		b.style.display = "inline-block";
		b.style.verticalAlign = "middle";
		b.style.height = options.height+"px";
		b.style.backgroundColor = options.color;
		b.style.color = options.textColor;
		b.style.font = options.font;
		b.textContent = textContent;
		options.container.appendChild(b);
		return b;
	}
	function resetClipping(side) {
		bars[side].clipped = false;
		bars[side].ele.style.backgroundColor = options.color;
		bars[side].inertia = 0;
	}
	function render(side,intensity,forceNoClipping) {
		if (options.clipping.exists) {
			if (bars[side].clipped) {
				if (forceNoClipping) {
					resetClipping(side);
				} else if (intensity !== 1) {
					bars[side].inertia++;
					if (bars[side].inertia > options.clipping.inertia) {
						resetClipping(side);
					}
				} else {
					bars[side].inertia = 0;
				}
			} else if (intensity === 1) {
				bars[side].clipped = true;
				bars[side].ele.style.backgroundColor = options.clipping.color;
			}
		}
		bars[side].ele.style.width = Math.floor(defaultSize + sizeMultiplier*intensity)+"px";
	}
	function renderZero() {
		render("left",0,true);
		render("right",0,true);
	}
	options.waveformPlayer.addEventListener("afterwaveformrender",function() {
		var loudness = options.waveformPlayer.getStereoVolume(options.granularity);
		render("left",loudness.left);
		render("right",loudness.right);
	});
	options.waveformPlayer.addEventListener("stop",renderZero);
	options.waveformPlayer.addEventListener("audiodone",renderZero);
}