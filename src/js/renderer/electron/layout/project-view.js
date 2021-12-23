// Project view
import { onHTMLTabCreated } from './tab/html-project-view.js';

let ProjectViewsList = {}

let HOW_MANY_CREATED = 0;
function createInstance(elem) {
    // Make id for new project view
    const id = `project-view-${++HOW_MANY_CREATED}`;
    // Create all the required element
    let projectView = document.createElement('div');
    let projectToolbar = document.createElement('div');
    let projectCode = document.createElement('div');
    // Create all the child elements
    let projectTabBar = document.createElement('div');
    let projectTabAddButton = document.createElement('button');
    let projectActionBar = document.createElement('div');
    // Assign required attribute to required element
    projectView.setAttribute('id', id);
    projectView.setAttribute('current-tab', '0');
    projectView.classList.add('m-fragment', 'm-fragment-layout', 'm-fragment-right', 'm-fragment-full', 'project-view');
    projectToolbar.classList.add('m-layout', 'm-layout-column', 'm-top', 'project-toolbar');
    projectCode.classList.add('m-layout', 'm-layout-full', 'm-middle', 'project-code');
    // Assign required attribute to child elements
    projectTabBar.classList.add('m-fragment', 'm-fragment-full', 'project-tab-bar');
    projectTabAddButton.classList.add('project-tab-add');
    projectTabAddButton.innerText = '+';
    projectTabAddButton.addEventListener('click', () => addTab('html', 'semangat.html'));
    projectActionBar.classList.add('m-fragment', 'm-fragment-full', 'project-actionbar');
    // Append all the element to the parent element
    projectView.append(projectToolbar, projectCode);
    projectToolbar.append(projectTabBar, projectActionBar);
    projectTabBar.append(projectTabAddButton);
    // Append to dom
    // If dom parameter has no input then append to workspace instead
    if(elem !== undefined) {
        elem.appendChild(this.projectView);
        ProjectViewsList[id] = {
            id: id,
            projectView,
            projectToolbar,
            projectCode,
            projectTabBar,
            projectActionBar,
        }
        return id;
    } else {
        document.getElementById('workspace-middle').appendChild(projectView);
        ProjectViewsList[id] = {
            id: id,
            projectView,
            projectToolbar,
            projectCode,
            projectTabBar,
            projectActionBar,
        }
        return id;
    }
}

function addTab(id, title, type, options) {
    // Create button element
    let tabButton = document.createElement('button');
    tabButton.classList.add('project-tab');
    tabButton.innerText = title;

    switch (type) {
        case 'html':
            onHTMLTabCreated();
            break;
        default:
            break;
    }
    ProjectViewsList[id]
}

/**
 * Is there any project view in DOM?
 * @returns boolean
 */
function hasAddedToDOM() {
    if(Object.keys(ProjectViewsList).length == 0) return false;
    else return true;
}
let ProjectViewManager = {
    createInstance,
    hasAddedToDOM,
    addTab
}
export { ProjectViewManager }