(function(){
	var isBrowser = function(){try {return this===window;}catch(e){ return false;}}
	var _root = isBrowser() ? window : global;
	_root.Lyrics = function(text_lrc){
		/* Private */
		var timestamp_offset = 0;
		var lyrics_all = undefined;

		_root.Lyrics.prototype.load = function(text_lrc){
			lyrics_all = new Array();
			timestamp_offset = 0;
			var lines_all = String(text_lrc).split('\n');
			for (var i = 0; i < lines_all.length; i++) {
				var line = lines_all[i].replace(/(^\s*)|(\s*$)/g,'');
				if (!line) {
					continue;
				}
				var timestamp_all = Array();
				while (true) {
					var match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(line);
					if (match) {
						timestamp_all.push(match[1]);
						line = match[match.length-1].replace(/(^\s*)|(\s*$)/g,'');
					} else {
						break;
					}
				}
				for (var j = 0; j < timestamp_all.length; j++) {
					var ts_match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.(\d+))?\]$/g.exec(timestamp_all[j]);
					if (ts_match) {
						lyrics_all.push({
							timestamp:Number(ts_match[1])*60 + Number(ts_match[2]) + (ts_match[4] ? Number('0.'+ts_match[4]) : 0),
							text:line
						});
					}
				}
			}
			lyrics_all.sort(function(a,b){
				return (a.timestamp > b.timestamp ? 1 : -1);
			});
			if (lyrics_all.length) {
				return true;
			} else {
				lyrics_all = undefined;
				return false;
			}
		}

		/* Public */
		_root.Lyrics.prototype.getLyrics = function(){
			return lyrics_all;
		}
		_root.Lyrics.prototype.getLyric = function(idx){
			try{
				return lyrics_all[idx];
			}catch(e){
				return undefined;
			}
		}
		_root.Lyrics.prototype.getTimeOffset = function() {
			return timestamp_offset;
		}
		_root.Lyrics.prototype.setTimeOffset = function(offset) {
			timestamp_offset = isNaN(offset) ? 0 : Number(offset);
		}
		_root.Lyrics.prototype.select = function(ts){
			if (isNaN(ts)) {
				return -1;
			}
			var timestamp = Number(ts) + timestamp_offset;
			var i = 0;
			if (timestamp < lyrics_all[0].timestamp) {
				return -1;
			}
			for (i = 0; i < (lyrics_all.length - 1); i++) {
				if (lyrics_all[i].timestamp <= timestamp
					&& lyrics_all[i+1].timestamp > timestamp) {
					break;
				}
			}
			return i;
		}

		if (text_lrc) {
			this.load(text_lrc);
		}
	}
})();
