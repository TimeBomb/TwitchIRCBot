// TODO: Create reload api function that intelligently allows to reload only certain [or reload all but certain] extensions
module.exports = function (bot) {
	var store = {};
	var onLoadCallbacks = {};
	var hooks = [];

	// Extension Scaffolding
	function Extension(id) {
		return {
			'config': bot.config[id] || {}, // ext key-vaLue store
			'storage': bot.storage[id] || {}, // ext key-value store
			'api': {}, // ext functions
		};
	}

	function hook(callback) {
		hooks.push(callback);

		return bot;
	};

	// Clears then loads all extensions
	function load (path) {
		store = {};
		onLoadCallbacks = {};

		// Loads uninvocated extension object
		var loadExtension = function (ext) {
			try {
				// Extension already loaded or extension still requires other extensions
				if (store.hasOwnProperty(ext.id) || (ext.requires && ext.requires.length > 0)) {
					return;
				}

				var loadExt = function(extension) {
					store[extension.id] = extension.run(Extension(extension.id), bot);

					if (typeof store[extension.id] === 'undefined') {
						throw 'Extension "' + extension.id + '" must return extension object; currently returns nothing.';
					}

					bot.config[extension.id] = store[extension.id].config;
					bot.storage[extension.id] = store[extension.id].storage;
					bot[extension.id] = store[extension.id].api;

					console.log('Loaded Extension: ' + extension.id);

					if (onLoadCallbacks.hasOwnProperty(extension.id)) {
						for (var i = 0, len = onLoadCallbacks[extension.id].length; i < len; i++) {
							onLoadCallbacks[extension.id][i]();
						}
					}
				};

				var stopLoading = false;
				for(var i = 0, len = hooks.length; i < len; i++) {
					if (hooks[i](ext, loadExt) === true) {
						stopLoading = true;
					}
				}
				if (stopLoading !== true) {
					loadExt(ext);
				}
			} catch (e) {
				console.error('ERROR: Problem loading extension "' + ((ext ? ext.id : '?') || '?') + '": ' + e);
			}
		};

		// Get all extensions in path
		var fs = require('fs');
		var dirs = fs.readdirSync(path);
		var onLoadCallback = function (ext, requiredExt) {
			return function () {
				ext.requires.splice(ext.requires.indexOf(requiredExt, 1));
				loadExtension(ext);
			};
		};

		for (var i = 0, len = dirs.length; i < len; i++) {
			var extPath = path + '/' + dirs[i] + '/main.js';
			if (!fs.existsSync(extPath)) {
				console.warn('WARNING: Extension Path: "' + extPath + '" does not exist.');
				continue;
			}
			
			// Load an extension
			var ext = require(extPath);
			if (store.hasOwnProperty(ext.id)) {
				throw 'ERROR: Extension with ID: "' + extension.id + '" already exists.';
			}

			// Check to make sure required extensions are loaded; if not, wait to load this extension
			if (ext.requires && ext.requires.length > 0) {
				for (var ii = ext.requires.length - 1; ii >= 0; ii--) {
					var requiredExt = ext.requires[ii];
					if (!store.hasOwnProperty(requiredExt)) {
						onLoadCallbacks[requiredExt] = onLoadCallbacks[requiredExt] || [];
						onLoadCallbacks[requiredExt].push(onLoadCallback(ext, requiredExt));
					} else {
						onLoadCallback(ext, requiredExt)();
					}
				}
			} else {
				loadExtension(ext);
			}
		}

		return bot;
	}

	return {
		'load': load,
		'all': store,
		'hook': hook
	};
};