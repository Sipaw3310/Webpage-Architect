//import { text_editor_code } from '../code.js'

const resizeObserver = new ResizeObserver(entries => {
    for(let entry of entries) {
        if(entry.contentBoxSize) {
            const project_view_size = [
                document.getElementById('project-view').getBoundingClientRect().width,
                document.getElementById('project-view').getBoundingClientRect().height
            ];
            text_editor_code.layout({
                width: project_view_size[0], 
                height: project_view_size[1] - 57
            });
        }
    }
});
export function observeProjectCodeLayout() {
    resizeObserver.observe(document.getElementById('code-editor'));
}