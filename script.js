function File(path,title,artist,album,key) {
	this.path = path;
	this.title = title;
	this.artist = artist;
	this.album = album;
	this.key = key;
}
function getName(item,by) {
	var res = item.title;
	if (by !== "title") {
		res = item[by]+" ("+res+")";
	}
	return res;
}
function urlKeys(obj,startWithAmp) {
	startWithAmp = typeof startWithAmp === "boolean" ? startWithAmp : false;
	var res = "";
	for (var item in obj) {
		if (obj.hasOwnProperty(item)) {
			res += "&"+item+"="+obj[item];
		}
	}
	if (!startWithAmp) {
		res = res.substr(1);
	}
	return res;
}
function setupSongList(by) {
	select.innerHTML = "";
	var options = [];
	var option;
	for (var item in cipher) {
		if (cipher.hasOwnProperty(item)) {
			option = document.createElement("option");
			option.value = item;
			option.textContent = getName(cipher[item],by);
			if (item === chosen.key) {
				option.selected = "selected";
			}
			options.push(option);
		}
	}
	options.sort(function(a,b) {
		return a.textContent.toLowerCase().localeCompare(b.textContent.toLowerCase());
	});
	for (var i = 0; i < options.length; i++) {
		select.appendChild(options[i]);
	}
	updateExtraBy(by);
}
function updateExtraBy(by) {
	if (by !== "title") {
		extra.by = by;
	} else if (extra.hasOwnProperty("by")) {
		delete extra.by;
	}
}
var interface;
var select;
var cipher = {};
var extra = {};
var chosen;
window.addEventListener("DOMContentLoaded",function() {
	if (window.AudioContext || window.webkitAudioContext) {
		songs = parseXMLFromString(songs).getElementsByTagName("song");
		var key;
		for (var i = 0; i < songs.length; i++) {
			key = songs[i].getAttribute("id");
			cipher[key] = new File(songs[i].getAttribute("file"),songs[i].querySelector("title").textContent,songs[i].querySelector("artist").textContent,songs[i].querySelector("album").textContent,key);
		}
		var query = extractQuery();
		chosen = cipher.hasOwnProperty(query.f) ? cipher[query.f] : cipher.muffet;
		var interface = document.getElementById("interface");
		var width = 700;
		if (query.width) {
			query.width = parseInt(query.width);
			if (!isNaN(query.width) && query.width > 0) {
				width = query.width;
				extra.width = query.width;
			}
		}
		var clipping = false;
		if (query.clip) {
			query.clip = query.clip.toLowerCase();
			if (query.clip === "true" || query.clip === "false") {
				clipping = query.clip === "true";
				extra.clip = query.clip;
			}
		}
		var loop = false;
		if (query.loop) {
			query.loop = query.loop.toLowerCase();
			if (query.loop === "true" || query.loop === "false") {
				loop = query.loop === "true";
				extra.loop = query.loop;
			}
		}
		var jade = "#4ac925";
		var aradia = "#a10000";
		var interfaceContainer = interface;
		interface = new WFPInterface({
			audio: {
				file: "audio/"+chosen.path,
				loop: loop,
				autoplay: true
			},
			width: width,
			container: interface,
			waveform: {
				height: 400,
				color: jade,
				refreshRate: 45
			},
			bars: {
				height: 16,
				color: jade
			},
			timeline: {
				height: 128,
				playhead: {
					arrowColor: jade,
					lineColor: aradia
				},
				bar: {
					color: "#005682"
				},
				delimiters: {
					color: "white",
					text: {
						color: "#ffbe00"
					}
				},
				waveform: {
					meanType: MeanType.GEOMETRIC,
					pastColor: "#3232c8",
					futureColor: "#6464dc",
					meanPastColor: aradia,
					meanFutureColor: "#77003c",
					clippingExists: clipping
				}
			},
			buttons: {
				type: "button",
				buttonClassName: "btn clearRight"
			},
			metadata: {
				exists: true,
				title: chosen.title,
				artist: "A noise created by <em>\""+chosen.artist+"\"</em>",
				album: "From the collection of noises know as <em>\""+chosen.album+"\"</em>",
				containerClassName: "metadata",
				titleClassName: "metadataTitle",
				artistClassName: "metadataArtist",
				albumClassName: "metadataAlbum"
			}
		});
		interface.player.addEventListener("decoded",function() {
			interface.player.setWaveformThickness(2);
		});
		select = document.createElement("select");
		var by = "title";
		if (query.by) {
			query.by = query.by.toLowerCase();
			if (query.by === "title" || query.by === "artist" || query.by === "album") {
				by = query.by;
			}
		}
		select.addEventListener("change",function() {
			location.href = location.origin+location.pathname+"?f="+select.value+urlKeys(extra,true);
		});
		setupSongList(by);
		var sortList = document.createElement("select");
		var setupOption = function(value,text) {
			var option = document.createElement("option");
			option.value = value;
			option.textContent = text;
			if (by === value) {
				option.selected = "selected";
			}
			sortList.appendChild(option);
		};
		setupOption("title","Sort by Title");
		setupOption("artist","Sort by Artist");
		setupOption("album","Sort by Album");
		sortList.addEventListener("change",function() {
			setupSongList(sortList.value);
		});
		var p;
		var hang = setTimeout(function() {
			p = document.createElement("p");
			p.innerHTML = "Note that this tech demo can sometimes hang on Opera, giving no error message to tell me that this is unsupported. Try refreshing the page, and if that doesn't fix the problem switch to another browser.<br />If you are not using Opera and you are seeing this message, either your computer is slow, the song you requested is long, or both.";
			document.body.appendChild(p);
		},10000);
		interface.player.addEventListener("decoded",function() {
			clearTimeout(hang);
			if (typeof p !== "undefined") {
				document.body.removeChild(p);
			}
			interfaceContainer.appendChild(select);
			interfaceContainer.appendChild(sortList);
			sortList.style.marginLeft = (width - (select.offsetWidth + sortList.offsetWidth))+"px"; // width all - (width normal + width this)
		});
	} else {
		document.body.innerHTML = "<p>ERROR: You are using an unsupported browser. To see which browsers are compatible with this tech demo, see <a target='_blank' href='http://caniuse.com/#feat=audio-api'>this page</a>.</p>";
	}
});