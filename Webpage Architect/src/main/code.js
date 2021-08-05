function onLoad() {
    // If there is no recent project
    if(localStorage.getItem('haveOpened') != 'true') {
        document.getElementById('welcome-screen-bg').style.display = 'flex';
    }
    // Get all drag elements
    var ehDrag = document.getElementById('element_hub-drag');
    var inDrag = document.getElementById('tool_hub-drag');
    // Add an event listener to them
    ehDrag.addEventListener('mousedown', function(e) {
        e.preventDefault();
        window.addEventListener('mousemove', window_drag.element_hubDrag);
        window.addEventListener('mouseup', function() {
            window.removeEventListener('mousemove', window_drag.element_hubDrag);
        });
        console.log('mousedown');
    });
    inDrag.addEventListener('mousedown', function(e) {
        e.preventDefault();
        window.addEventListener('mousemove', window_drag.tool_hubDrag);
        window.addEventListener('mouseup', function() {
            window.removeEventListener('mousemove', window_drag.tool_hubDrag);
        });
        console.log('mousedown');
    });

    onIframeLoad();
    action_hub.init();
}

// Window Drag functions
var window_drag = {
    tool_hubDrag: function(e) {
        var tool_hubElem = document.getElementById('tool_hub');
        var workspaceElem = document.getElementById('workspace');
        var tool_hub_new_width = tool_hubElem.getBoundingClientRect().width - (e.pageX - tool_hubElem.getBoundingClientRect().left);
        var workspace_new_width = e.pageX - workspaceElem.getBoundingClientRect().left;
        console.log('mousemove ' + e.pageX + ' ' + tool_hubElem.getBoundingClientRect().left);
        if(tool_hub_new_width > 210 && workspace_new_width > 300) {
            tool_hubElem.style.width = tool_hub_new_width + 'px';
            var element_hubWidth = document.getElementById('element_hub').getBoundingClientRect().width;
            workspaceElem.style.width = "calc(100% - " + (tool_hub_new_width + element_hubWidth + 45 + 35) + 'px)';
        }
    },
    element_hubDrag: function(e) {
        var element_hubElem = document.getElementById('element_hub');
        var workspaceElem = document.getElementById('workspace');
        var element_hub_new_width = e.pageX - element_hubElem.getBoundingClientRect().left;
        var workspace_new_width = workspaceElem.getBoundingClientRect().width - (e.pageX - workspaceElem.getBoundingClientRect().left);
        
        if(element_hub_new_width > 210 && workspace_new_width > 300) {
            element_hubElem.style.width = element_hub_new_width + 'px';

            var tool_hubWidth;
            if(tool_hub.INSPECTOR_STATE) {
                tool_hubWidth = document.getElementById('tool_hub').getBoundingClientRect().width + 35;
            } else {tool_hubWidth = 0;}
            workspaceElem.style.width = "calc(100% - " + (tool_hubWidth + element_hub_new_width + 45) + 'px)';
        }
    }
}

// Project controller
var architect = {
    newProject: function(type) {
        switch(type) {
            case 'blank':
            //localStorage.setItem('haveOpened', 'true');
            document.getElementById('welcome-screen-bg').style.display = 'none';
            break;
        }
    }
}

// The object for handling user content
var userContent =  {
    IFRAME_CONTENT: '', // The current iframe contentWindow
    CURRENT_SELECTED: '', // The current selected element
    editor: {
        // User content elements data
        userChange: [
            // This is just for an example
            {id: 'p-0', type: 'paragraph', properties: {
                // The element properties (style, location, etc)
                textColor: '#ff0000', // must in hex
                backgroundColor: 'transparent' // must in hex
            }}
        ]
    },
    // If workspace is clicked
    workspaceClicked: function() {
        if(this.CURRENT_SELECTED != '') {
            this.CURRENT_SELECTED.setAttribute('focus', 'false');
            // If tool_hub is open
            if(tool_hub.INSPECTOR_STATE == true) {
                document.getElementById('tool_hub-design-page').style.display = 'none';

                tool_hub.INSPECTOR_STATE = false;
            }
        }
    },
    // For modifying element
    modify: {
        bold: function() {
            userContent.IFRAME_CONTENT.document.execCommand('bold', false);
        },
        italic: function() {
            userContent.IFRAME_CONTENT.document.execCommand('italic', false);
        },
        underline: function() {
            userContent.IFRAME_CONTENT.document.execCommand('underline', false);
        },
        strikeThrough: function() {
            userContent.IFRAME_CONTENT.document.execCommand('strikeThrough', false);
        },
        textColor: function(hexcolor) {
            userContent.IFRAME_CONTENT.document.execCommand('foreColor', false, hexcolor);
        }
    },
    // For handling paragraph content
    paragraph: {
        INDEX: 0, // Only used for assigning id when creating a new paragraph
        // If paragraph is clicked
        paragraphClicked: function(elem) {
            var tool_hub_design_page = document.getElementById('tool_hub-design-page');

            if(userContent.CURRENT_SELECTED != '') {
                userContent.CURRENT_SELECTED.setAttribute('focus', 'false');
            }
            // Pass the current element to userContent.CURRENT_SELECTED to be used later
            userContent.CURRENT_SELECTED = elem;
            
            // Notify tool_hub to update it's element
            action_hub.font.notify(elem.id);
            // Focus the selected paragraph
            elem.setAttribute('focus', 'true');

            // Show tool_hub if tool_hub is hidden
            if(!tool_hub.INSPECTOR_STATE) {
                tool_hub_design_page.style.display = 'block';

                tool_hub.INSPECTOR_STATE = true;
            }
        }
    }
};



// Misclleneous

window.onerror = function(message, url, line) {
    var errorInfoText = document.getElementById('error-info-text');
    errorInfoText.innerText = message + ":" + url + ":" + line;
    document.getElementById('error-info').style.display = 'flex';
}

document.addEventListener('keypress', function(event) {
    if(event.key == '5') {
        location.reload();
    }
});

util = {
    color: {
        // For converting rgb to hex
        // From https://css-tricks.com/converting-color-spaces-in-javascript/
        RGBToHex: function(r,g,b) {
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
          
            if (r.length == 1)
              r = "0" + r;
            if (g.length == 1)
              g = "0" + g;
            if (b.length == 1)
              b = "0" + b;
          
            return "#" + r + g + b;
        },
        // For converting css rgba to hex (opacity is ignored) > rgba(255, 255, 255, 1)
        // From http://wowmotty.blogspot.com/2009/06/convert-jquery-rgb-output-to-hex-color.html
        cssRGBToHex: function(orig){
            var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
            return (rgb && rgb.length === 4) ? "#" +
             ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
             ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
        }
    }
};