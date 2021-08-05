// Configure amd require
require.config({ paths: {'vs': 'lib/monaco-editor/min/vs'} });

function instantiateMonaco(elem, callback) {
	require(['vs/editor/editor.main'], () => {
		console.log('amdrequire init');
		let instance = monaco.editor;
		let standaloneInstance = instance.create(elem, {
			theme: 'vs-dark',
			fontFamily: 'monospace'
		});
		callback(instance, standaloneInstance);
	});
}

export { instantiateMonaco }