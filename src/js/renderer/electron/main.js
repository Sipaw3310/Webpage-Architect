// Pass Monaco's require to a new variable
// and pass Electron's require to original require
//console.log(global.require);
//console.log(electronRequire)

import { ProjectViewManager } from './layout/project-view.js';

let projectViewId = ProjectViewManager.createInstance();
console.log(ProjectViewManager.hasAddedToDOM());
ProjectViewManager.addTab(projectViewId, 'abcdefg', 'html', { value: '<!DOCTYPE html>' });