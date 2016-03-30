var MeanType = {
	ARITHMETIC: 1,
	GEOMETRIC: 2,
	HARMONIC: 3
};
function WaveformPlayer(audioFile,container,waveformColor,refreshRate,autoplay) {
	if (typeof audioFile !== "string" || typeof container.tagName !== "string" || typeof waveformColor !== "string" || typeof refreshRate !== "number" || typeof autoplay !== "boolean") {
		throw new TypeError("One or more required parameters are undefined or are not the correct type.");
	}

	// Setup: Initialization
	function updateWaveformSize() {
		waveform.width = container.offsetWidth;
		waveform.height = container.offsetHeight;
		waveform.halfHeight = waveform.height/2;
		waveform.granularity = Math.floor(waveform.width/2);
		waveform.canvas.width = waveform.width;
		waveform.canvas.height = waveform.height;
	}
	var audio = {
		"file": audioFile,
		"context": new AudioContext(),
		"buffer": null,
		"gain": null,
		"volume": 1,
		"data": [],
		"dataLeft": [],
		"dataRight": [],
		"source": null,
		"playhead": 0,
		"truePlayhead": 0,
		"offset": 0,
		"startTime": 0,
		"ready": false,
		"playing": false,
		"length": 0
	};
	if (typeof autoplay !== "boolean") {
		audio.autoplay = false;
	} else {
		audio.autoplay = autoplay;
	}
	var waveform = {
		container: container,
		thickness: 2,
		color: waveformColor,
		canvas: document.createElement("canvas"),
		timeout: 1000/refreshRate
	};
	updateWaveformSize();
	waveform.container.appendChild(waveform.canvas);
	waveform.container.addEventListener("resize",updateWaveformSize);
	waveform.context = waveform.canvas.getContext("2d");
	waveform.context.strokeStyle = waveform.color;
	waveform.context.lineWidth = waveform.thickness;

	// Playback control
	var allowSourceEnd = true;
	function sourceEnd() {
		if (allowSourceEnd && audio.playing) {
			audio.playhead = 0;
		}
		allowSourceEnd = true;
	}
	function beginPlayback() {
		audio.truePlayhead += audio.offset;
		audio.source = audio.context.createBufferSource();
		audio.source.buffer = audio.buffer;
		audio.gain = audio.context.createGain();
		audio.source.connect(audio.gain);
		audio.gain.connect(audio.context.destination);
		audio.gain.gain.value = audio.volume;
		audio.source.onended  = sourceEnd;
		audio.source.start(0,audio.playhead);
		audio.startTime = Date.now();
		audio.playing = true;
	}
	function haltPlayback(pause) {
		allowSourceEnd = false;
		audio.source.stop(0);
		if (pause) {
			var change = (Date.now() - audio.startTime)/1000;
			audio.playhead += change;
			audio.offset += change;
		} else {
			audio.playhead = 0;
			audio.offset = 0;
			audio.truePlayhead = 0;
			drawZeroLine();
		}
		audio.playing = false;
	}
	this.togglePlay = function() {
		if (audio.ready) {
			if (audio.playing) {
				haltPlayback(true);
				fireEvent("pause");
			} else {
				beginPlayback();
				fireEvent("play",false);
			}
			fireEvent("playstatechange",audio.playing);
			return true;
		}
		return false;
	};
	this.stop = function() {
		if (audio.ready) {
			haltPlayback(false);
			fireEvent("stop");
			fireEvent("playstatechange",audio.playing);
			return true;
		}
		return false;
	};
	this.seek = function(seekTo) {
		if (audio.ready) {
			if (typeof seekTo === "number") {
				if (seekTo >= 0 && seekTo < audio.length) {
					var p = audio.playing;
					if (p) {
						haltPlayback(true);
					}
					audio.playhead = seekTo;
					audio.offset = seekTo;
					audio.truePlayhead = seekTo;
					if (p) {
						beginPlayback();
					}
					fireEvent("seek");
				}
				return true;
			}
		}
		return false;
	};
	this.seekRelative = function(seekTo) {
		if (audio.ready && typeof seekTo === "number") {
			return this.seek(seekTo + audio.truePlayhead);
		}
		return false;
	};
	this.getPlayhead = function() {
		if (audio.ready) {
			return audio.truePlayhead;
		}
		return false;
	};
	this.getPlayheadInt = function() {
		if (audio.ready) {
			return Math.floor(audio.truePlayhead);
		}
		return false;
	};
	this.getAudioLength = function() {
		if (audio.ready) {
			return audio.length;
		}
		return false;
	};
	this.getAudioLengthInt = function() {
		if (audio.ready) {
			return Math.floor(audio.length);
		}
		return false;
	};
	this.getMonoVolume = function(granularity,timestamp) {
		if (audio.ready) {
			var data = setupCalledGrab(granularity,timestamp,false);
			var max = Math.abs(data.mono[0]);
			var abs;
			for (var i = 1; i < data.mono.length; i++) {
				abs = Math.abs(data.mono[i]);
				if (abs > max) {
					max = abs;
				}
			}
			return max;
		}
		return false;
	};
	this.getStereoVolume = function(granularity,timestamp) {
		if (audio.ready) {
			var data = setupCalledGrab(granularity,timestamp,true);
			var max = {
				left: Math.abs(data.left[0]),
				right: Math.abs(data.right[0])
			};
			var abs;
			var lgt = Math.max(data.left.length,data.right.length);
			for (var i = 1; i < lgt; i++) {
				if (typeof data.left[i] !== "undefined") {
					abs = Math.abs(data.left[i]);
					if (abs > max.left) {
						max.left = abs;
					}
				}
				if (typeof data.right[i] !== "undefined") {
					abs = Math.abs(data.right[i]);
					if (abs > max.right) {
						max.right = abs;
					}
				}
			}
			return max;
		}
		return false;
	};
	this.getAudioFile = function() {
		return audio.file;
	};
	this.getAudioVolume = function() {
		return audio.volume;
	};
	this.setAudioVolume = function(vol) {
		if (typeof vol === "number") {
			audio.volume = vol;
			audio.gain.gain.value = audio.volume;
			fireEvent("audiovolumeset");
			return true;
		}
		return false;
	};
	this.isPlaying = function() {
		if (audio.ready) {
			return audio.playing;
		}
		return false;
	};
	this.getByteLength = function() {
		return audio.buffer.length;
	};

	// Waveform rendering
	function drawZeroLine() {
		fireEvent("beforewaveformrender");
		waveform.context.clearRect(0,0,waveform.width,waveform.height);
		waveform.context.beginPath();
		waveform.context.moveTo(0,waveform.halfHeight);
		waveform.context.lineTo(waveform.width,waveform.halfHeight);
		waveform.context.stroke();
		var data = [];
		for (var i = 0; i < waveform.width; i++) {
			data[i] = 0;
		}
		fireEvent("afterwaveformrender",data);
	}
	function grabData(granularity,timestamp,stereo) {
		var pos = Math.floor(audio.data.length*timestamp/audio.length);
		var start = pos - granularity;
		var end = pos + granularity + 1;
		if (start < 0) {
			end -= start;
			start = 0;
		}
		if (end >= audio.data.length) {
			start -= audio.data.length - end;
			end = audio.data.length;
		}
		var data = {
			start: start,
			end: end
		};
		var i;
		if (stereo) {
			data.left = [];
			data.right = [];
			for (i = start; i < end; i++) {
				data.left[data.left.length] = audio.dataLeft[i];
				data.right[data.right.length] = audio.dataRight[i];
			}
		} else {
			data.mono = [];
			for (i = start; i < end; i++) {
				data.mono[data.mono.length] = audio.data[i];
			}
		}
		return data;
	}
	function setupCalledGrab(granularity,timestamp,stereo) {
		if (typeof granularity !== "number") {
			granularity = waveform.granularity;
		}
		if (typeof timestamp !== "number") {
			timestamp = audio.truePlayhead;
		}
		if (typeof stereo !== "boolean") {
			stereo = false;
		}
		return grabData(granularity,timestamp,stereo);
	}
	function canvasYActual(n) {
		return n*waveform.halfHeight + waveform.halfHeight;
	}
	function fireTick() {
		setTimeout(fireTick,waveform.timeout);
		fireEvent("beforetick");
		var res = false;
		if (audio.playing) {
			if (audio.ready) {
				audio.truePlayhead = audio.offset + (Date.now() - audio.startTime)/1000;
				fireEvent("beforewaveformrender");
				var data = grabData(waveform.granularity,audio.truePlayhead,false);
				if (data.end === audio.data.length) {
					haltPlayback(false);
					fireEvent("audiodone");
					fireEvent("playstatechange",audio.playing);
				} else {
					waveform.context.clearRect(0,0,waveform.width,waveform.height);
					waveform.context.beginPath();
					waveform.context.moveTo(0,canvasYActual(data.mono[0]));
					for (var i = 1; i < data.mono.length; i++) {
						waveform.context.lineTo(i,canvasYActual(data.mono[i]));
					}
					waveform.context.stroke();
					res = true;
				}
				fireEvent("afterwaveformrender",data);
			} else {
				fireEvent("waveformrenderfail");
			}
			fireEvent("playing");
		} else {
			fireEvent("waveformrenderfail");
			fireEvent("notplaying");
		}
		res = false;
		fireEvent("aftertick");
		return res;
	}
	this.getWaveformColor = function() {
		return waveform.color;
	};
	this.setWaveformColor = function(col) {
		waveform.context.strokeStyle = col;
		waveform.color = col;
	};
	this.getWaveformThickness = function() {
		return waveform.thickness;
	};
	this.setWaveformThickness = function(thk) { // TODO: Rename variable "thickness"
		if (typeof thk === "number") {
			if (thk > 0) {
				waveform.context.lineWidth = thk;
				waveform.thickness = thk;
				return true;
			}
		}
		return false;
	};
	this.getWaveformContainer = function() {
		return waveform.container;
	};
	this.getWaveformRefreshRate = function() {
		return 1000*Math.pow(waveform.timeout,-1);
	};
	this.setWaveformRefreshRate = function(rr) { // TODO: Rename variable "refreshRate"
		if (typeof rr === "number") {
			if (rr > 0) {
				waveform.timeout = 1000/rr;
				return true;
			}
		}
		return false;
	};
	this.getWaveformMonoData = function(granularity,timestamp) {
		return setupCalledGrab(granularity,timestamp,false);
	};
	this.getWaveformStereoData = function(granularity,timestamp) {
		return setupCalledGrab(granularity,timestamp,true);
	};
	this.getWaveformGranularity = function() {
		return waveform.granularity;
	};

	// Events
	var eventHandlers = {
		loaded: [], // Fires when the audio file has been loaded
		decoded: [], // Fires when the audio file has been decoded - this is the soonest the audio is able to be played
		decodeerror: [], // Fires if the audio fails to decode
		beforewaveformrender: [], // Fires just before the waveform for any given tick is rendered
		afterwaveformrender: [], // Fires just after the waveform for any given tick is rendered
		waveformrenderfail: [], // Fires if a waveform render fails on any given tick
		beforetick: [], // Fires before every given tick
		aftertick: [], // Fires after every given tick
		pause: [], // Fires once when playback is paused
		play: [], // Fires once when playback is started/resumed
		playstatechange: [],
		playing: [], // Fires while audio is playing on any given tick
		notplaying: [], // Fires while audio is not playing on any given tick
		stop: [], // Fires once when playback is stopped
		seek: [], // Fires once when the playhead seeks to a location
		audiodone: [], // Fires once when the playhead reaches the end of the audio clip
		audiovolumeset: [], // Fires when the volume is set
		waveformcolorset: [], // Fires when the waveform's color is set
		waveformthicknessset: [], // Fires when the waveform's thickness is set
		waveformrefreshrateset: [] // Fires when the waveform's refresh rate is set
	};
	function fireEvent(event,data) {
		var passData = typeof data !== "undefined";
		for (var i = 0; i < eventHandlers[event].length; i++) {
			try {
				if (passData) {
					eventHandlers[event][i](data);
				} else {
					eventHandlers[event][i]();
				}
			} catch (exceptionData){
				var str = exceptionData.name+": "+exceptionData.message;
				if (exceptionData.fileName) {
					str += " in "+exceptionData.fileName;
					if (excpetionData.lineNumber) {
						str += " on "+exceptionData.lineNumber;
					}
				}
				console.error(str+" - exception thrown from the following event handler:\n"+eventHandlers[event][i].toString());
			}
		}
	}
	this.addEventListener = function(event,func) {
		if (eventHandlers.hasOwnProperty(event) && typeof func === "function") {
			eventHandlers[event][eventHandlers[event].length] = func;
			return true;
		}
		return false;
	};
	this.removeEventListener = function(event,func) {
		if (eventHandlers.hasOwnProperty(event) && typeof func === "function") {
			var index = eventHandlers[event].indexOf(func);
			if (index !== -1) {
				eventHandlers[event].splice(index,1);
				return true;
			}
		}
		return false;
	};
	this.replaceEventListener = function(event,oldFunc,newFunc) {
		if (this.removeEventListener(event,oldFunc)) {
			return this.addEventListener(event,newFunc);
		}
		return false;
	};

	// Setup: XHR
	var req = new XMLHttpRequest();
	req.open("GET",audio.file,true);
	req.responseType = "arraybuffer";
	req.onload = function() {
		fireEvent("loaded");
		audio.context.decodeAudioData(req.response,function(buffer) {
			audio.buffer = buffer;
			audio.length = audio.buffer.duration;
			audio.dataLeft = audio.buffer.getChannelData(0);
			audio.dataRight = audio.buffer.getChannelData(1);
			var max = Math.max(audio.dataLeft.length,audio.dataRight.length);
			var sum;
			for (var i = 0; i < max; i++) {
				sum = 0;
				if (typeof audio.dataLeft[i] !== "undefined") {
					if (audio.dataLeft[i] < -1) {
						audio.dataLeft[i] = -1;
					} else if (audio.dataLeft[i] > 1) {
						audio.dataLeft[i] = 1;
					}
					sum += audio.dataLeft[i];
				}
				if (typeof audio.dataRight[i] !== "undefined") {
					if (audio.dataRight[i] < -1) {
						audio.dataRight[i] = -1;
					} else if (audio.dataRight[i] > 1) {
						audio.dataRight[i] = 1;
					}
					sum += audio.dataRight[i];
				}
				audio.data[i] = sum/2;
			}
			audio.ready = true;
			fireEvent("decoded",audio.data);
			if (audio.autoplay) {
				beginPlayback();
				fireEvent("play",true);
			}
			if (!fireTick()) {
				drawZeroLine();
			}
		},function() {
			fireEvent("decodeerror");
		});
	};
	req.send();
}


