// ProjectView class
import { instantiateMonaco } from './tab/monaco.js';
//import { HTMLProjectView } from './tab/html-project-view.js';

let howManyProjViewInstanstiated = 0;

class ProjectView {
    #HAS_ADDED_TO_DOM = false;
    #SELECTED_TAB_INDEX = -1;
    #MONACO_NOT_READY = -1;
    #IS_MONACO_VISIBLE = false;

    constructor() {
        this.id = `project-view-${howManyProjViewInstanstiated++}`;
        this.tabs = []
    }

    /**
     * Add ProjectView to the given element or to workspace-middle if not specified
     * @param {Document} elem 
     * @returns project-view
     */
    addViewToDom(elem) {
        // Create all the required element
        this.projectView = document.createElement('div');
        this.projectToolbar = document.createElement('div');
        this.projectCode = document.createElement('div');
        // Create all the child elements
        this.projectTabBar = document.createElement('div');
        this.projectTabAddButton = document.createElement('button');
        this.projectActionbar = document.createElement('div');
        // Assign required attribute to required element
        this.projectView.setAttribute('id', this.id);
        this.projectView.setAttribute('current-tab', '0');
        this.projectView.classList.add('m-fragment', 'm-fragment-layout', 'm-fragment-right', 'm-fragment-full', 'project-view');
        this.projectToolbar.classList.add('m-layout', 'm-layout-column', 'm-top', 'project-toolbar');
        this.projectCode.classList.add('m-layout', 'm-layout-full', 'm-middle', 'project-code');
        // Assign required attribute to childe elements
        this.projectTabBar.classList.add('m-fragment', 'm-fragment-full', 'project-tab-bar');
        this.projectTabAddButton.classList.add('project-tab-add');
        this.projectTabAddButton.innerText = '+';
        this.projectTabAddButton.addEventListener('click', () => this.addTab('html', 'semangat.html'));
        this.projectActionbar.classList.add('m-fragment', 'm-fragment-full', 'project-actionbar');
        // Append all the element to the parent element
        this.projectView.append(this.projectToolbar, this.projectCode);
        this.projectToolbar.append(this.projectTabBar, this.projectActionbar);
        this.projectTabBar.append(this.projectTabAddButton);
        // Append to dom
        // If dom parameter has no input then append to workspace instead
        if(elem !== undefined) {
            elem.appendChild(this.projectView);
            this.#HAS_ADDED_TO_DOM = true;
            return this.projectView;
        } else {
            document.getElementById('workspace-middle').appendChild(this.projectView);
            this.#HAS_ADDED_TO_DOM = true;
            return this.projectView;
        }
    }

    /**
     * Create a new project tab (ProjectView must has been added to DOM)
     * @param {string} type The type of the document, eg. html, javascript
     * @param {string} title The name of the document
     */
    addTab(type, title) {
        // Checkf if ProjectView has added to DOM
        if(this.#HAS_ADDED_TO_DOM) {
            let tabButton; // For storing button returned from #addTabButton
            let viewClass;
            
            switch (type) {
                case 'html':
                    tabButton = this.#addTabButton(title, this.tabs.length); // Create new tab button
                    if(this.monacoInstance == undefined) { // If monaco-editor hasn't instantiated, create one
                        this.#MONACO_NOT_READY = 1;
                        this.#createMonaco();
                    }
                    viewClass = new HTMLProjectView(title);
                    break;
                case 'javascript':
                    tabButton = this.#addTabButton(title, this.tabs.length); // Create new tab button
                    if(this.monacoInstance == undefined) { // If monaco-editor hasn't instantiated, create one
                        this.#MONACO_NOT_READY = 1;
                        this.#createMonaco();
                    }
                    viewClass = new JavascriptProjectView(title);
                    break;
                default:
                    break;
            }
            this.tabs.push({ 
                type: type, 
                title: title, 
                button: tabButton,
                view: viewClass,
                monaco: {
                    model: '',
                    viewState: ''
                },
                fragmentView: {}
            }); // Push all of the tab information
            console.table('addTab push', this.tabs);
        } else throw new Error("ProjectView hasn't been added to DOM, monaco-editor will couldn't be instantiated properly")
    }

    /**
     * Switch tab by "tabs" variable index
     * @param {int} index The index of the tab button according to "tabs" variable
     */
    switchTabByIndex(index) {
        const tab = this.tabs[index];
        console.log("The index: ",index, this.#SELECTED_TAB_INDEX);
        if(index === this.#SELECTED_TAB_INDEX) // If its the same selected tab, just ignore it
            return 0;
        tab.button.setAttribute('selected', 'true'); // Set the tab selected attribute to true
        this.removeAllActionButton();

        // Check if the tab is dependent on monaco-editor 
        if(tab.view.isUseMonaco) {
            if(!this.#IS_MONACO_VISIBLE) {
                this.codeEditor.style.display = 'block';
                this.#IS_MONACO_VISIBLE = true;
            }
            // Create new ITextModel if the tab doesn't has one (this may happen if the tab is newly created)
            if(tab.monaco.model == '') {
                console.log('Create new model')
                // Save previous tab's viewstate
                if(this.#SELECTED_TAB_INDEX !== -1) {
                    this.tabs[this.#SELECTED_TAB_INDEX].monaco.viewState = this.monacoStandaloneInstance.saveViewState();
                }
                // Create new monaco model and then switch to it
                tab.monaco.model = this.monacoInstance.createModel('', tab.type);
                this.monacoStandaloneInstance.setModel(tab.monaco.model);
                this.monacoStandaloneInstance.focus();
                
            } else {
                console.log('Switch model ', this.#SELECTED_TAB_INDEX);
                // Save previous tab's viewstate
                this.tabs[this.#SELECTED_TAB_INDEX].monaco.viewState = this.monacoStandaloneInstance.saveViewState();
                // Change monaco model to selected tab's model
                this.monacoStandaloneInstance.setModel(tab.monaco.model);
                // Set monaco viewstate to the current selected tab's viewstate
                if(tab.monaco.viewState !== '')
                    this.monacoStandaloneInstance.restoreViewState(tab.monaco.viewState);
                
                this.monacoStandaloneInstance.focus();
            }
            
        }

        // Call tab's onswitch function
        /*tab.view.onswitch(new TabContext(
            { hide: this.#hideMonaco, show: this.#showMonaco },
            this.#createFragmentView,
            { add: this.addActionButton, removeAll: this.removeAllActionButton }
        ));*/

        // Remove selected attribute from previous selected tab
        if(this.#SELECTED_TAB_INDEX !== -1) {
            this.tabs[this.#SELECTED_TAB_INDEX].button.setAttribute('selected', 'false');
        }

        this.#SELECTED_TAB_INDEX = index;
    }

    addActionButton(text, event) {
        console.log('addactionbutton called')
        let actionButton = document.createElement('button');
        actionButton.innerText = text;
        actionButton.addEventListener('click', (ev) => event);

        this.projectActionbar.appendChild(actionButton);

        return new ActionButton(actionButton);
    }

    removeAllActionButton() {
        let allActionButtons = this.projectActionbar.querySelectorAll('button');
        allActionButtons.forEach(i => {
            i.remove();
        });
    }

    // Private functions
    #createMonaco(index) {
        // Create new monaco instance
        this.codeEditor = document.createElement('div');
        this.codeEditor.classList.add('m-layout', 'm-layout-full', 'code-editor');
        this.projectCode.appendChild(this.codeEditor);

        instantiateMonaco(this.codeEditor, (instance, standaloneInstance) => {
            // If this is the first tab created, selects focus to the tab
            this.monacoInstance = instance;
            this.monacoStandaloneInstance = standaloneInstance;
            this.#IS_MONACO_VISIBLE = true;
            console.log(this.tabs[0], index)
            this.tabs[0].view.oncreate(this.addActionButton, this.removeAllActionButton)
            if(this.tabs.length == 1) {
                this.#MONACO_NOT_READY = 0;
                this.switchTabByIndex(0);
            }
        });
    }
    #addTabButton(title, index) {
        const tabButton = document.createElement('button');
        tabButton.classList.add('project-tab');
        tabButton.innerText = title;
        tabButton.addEventListener('click', () => this.switchTabByIndex(index));

        this.projectTabBar.insertBefore(tabButton, this.projectTabAddButton);

        return tabButton;
    }

    #hideMonaco() {
        this.codeEditor.style.display = 'none';
        this.#IS_MONACO_VISIBLE = false;
    }
    #showMonaco() {
        this.codeEditor.style.display = 'block';
        this.#IS_MONACO_VISIBLE = true;
    }

    #createFragmentView(index, options) {
        const tab = this.tabs[index];
        // ID format: code-{tab index}-{fragmentView length}
        const id = `code-${index}-${Object.keys(this.tabs[index].fragmentView).length}`;
        // Create new fragmentElement
        let fragmentElement = document.createElement('div');
        // Temporary variable: for storing classes required for fragmentElement
        let classes = ['m-fragment', 'm-fragment-full'];
        // Check if options parameter is passed in
        if(options !== undefined) {
            // Check if options has class array
            if(options.class !== undefined) {
                // Check if class is an array. If so, push class to classes variable
                if(typeof options.class == Array) classes.push(options.class);
                else throw new Error('Failed creating FragmentProjectView, class must be an array');
            }
        }
        // Add class and id to fragmentElement
        fragmentElement.classList.add(classes);
        fragmentElement.setAttribute('id', id);
        // Create new FragmentView to tab's fragmentView object
        tab.fragmentView[id] = new FragmentProjectView(fragmentElement, id);
        // If the tab index passed in is the current selected tab
        // Append the fragmentElement to projectCode
        if(index == this.#SELECTED_TAB_INDEX) {  
            this.projectCode.appendChild(fragmentElement);
        }

        return tab.fragmentView[id];
    }
}

/**
 * Class for handling fragment project view
 */
class FragmentProjectView {
    #fragmentElement;
    #onclickIndex = 0;
    #onclickList = [];
    /**
     * @param {Document} elem 
     * @param {String} id 
     */
    constructor(elem, id) {
        this.#fragmentElement = elem;

        this.id = id;
    }
    /**
     * Hide the FragmentProjectView
     */
    hide() {
        this.#fragmentElement.style.display = 'none';
    }
    /**
     * Show the FragmentProjectView
     */
    show() {
        this.#fragmentElement.style.display = 'block';
    }
    /**
     * Change the background
     * @param {String} color 
     */
    setBackgroundColor(color) {
        this.#fragmentElement.style.backgroundColor = color;
    }
}

/**
 * Class for handling action button
 * @param {Document} elem
 */
class ActionButton {
    #actionButton;
    constructor(elem) {
        this.#actionButton = elem;
    }
    onclick(callback) {
        this.#actionButton.addEventListener('click', (ev) => callback(ev));
    }
}

export { ProjectView };