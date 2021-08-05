// All functions related to action hub
var action_hub = {

    text_color_picker: '',

    // Must executed on load
    init: function() {
        this.font.init();
    },
    font: {
        CURRENT_SELECTED_TEXT_COLOR: "",

        // Prepare the font section
        init: function() {
            // Applying click listener on bold, italic, etc.
            document.getElementById('toolbar-bold').addEventListener('click', userContent.modify.bold);
            document.getElementById('toolbar-italic').addEventListener('click', userContent.modify.italic);
            document.getElementById('toolbar-underline').addEventListener('click', userContent.modify.underline);
            document.getElementById('toolbar-strikethrough').addEventListener('click', userContent.modify.strikeThrough);
            // Get color circle on workspace toolbar
            var inspector_textcolor_grid = document.getElementById('workspace-toolbar');
            var colorCircle = inspector_textcolor_grid.getElementsByClassName('inspector-color-circle');
            for(var i = 0; i < colorCircle.length; i++) {
                if(colorCircle[i].id != 'textcolor-custom') {
                    colorCircle[i].addEventListener('click', function(e) {
                        userContent.modify.textColor(e.target.style.backgroundColor, userContent.CURRENT_SELECTED);
                        e.target.setAttribute('focus', 'true');
                        if(action_hub.font.CURRENT_SELECTED_TEXT_COLOR !== "") {
                            if(e.target.id != action_hub.font.CURRENT_SELECTED_TEXT_COLOR.id)
                                action_hub.font.CURRENT_SELECTED_TEXT_COLOR.setAttribute('focus', 'false');
                        }
                        action_hub.font.CURRENT_SELECTED_TEXT_COLOR = e.target;
                    });
                } else {
                    var color_custom = document.getElementById('textcolor-custom');
                    // Create new color picker instance to textcolor-custom
                    /*action_hub.text_color_picker = new Pickr({
                        el: '#tool_hub',
                        theme: 'monolith',
                        position: 'bottom',
                    });
                    
                    action_hub.text_color_picker.on('save', color => {
                        color_custom.style.backgroundColor = action_hub.text_color_picker.color.toHEXA;
                        if(userContent.CURRENT_SELECTED != '') {
                            userContent.modify.textColor(action_hub.text_color_picker.color.toHEXA);
                        }
                        // Set textcolor-custom element to be focused
                        color_custom.setAttribute('focus', 'true');
                        if(action_hub.font.CURRENT_SELECTED_TEXT_COLOR != ''  && action_hub.font.CURRENT_SELECTED_TEXT_COLOR.id !=  'textcolor-custom') {
                            action_hub.font.CURRENT_SELECTED_TEXT_COLOR.setAttribute('focus', 'false');
                        }
                        action_hub.font.CURRENT_SELECTED_TEXT_COLOR = color_custom;
                    });*/
                }
            }
        },
        notify: function(id) {
            console.log(this.CURRENT_SELECTED_TEXT_COLOR.id + 'asdasd');
            
            if(this.CURRENT_SELECTED_TEXT_COLOR != '') {
                this.CURRENT_SELECTED_TEXT_COLOR.setAttribute('focus', 'false');
            }
            var textColor;
            // Find element data in editor.userChange by matching the id with element's id
            for(var i = 0; i < userContent.editor.userChange.length; i++) {
                if(userContent.editor.userChange[i].id == id) {
                    console.log('got!');
                    // Get every data from current element
                    textColor = userContent.editor.userChange[i].properties.textColor;
                }
            }
            // Check rgb color
            if(textColor !== undefined) {
                switch(textColor) {
                    case 'rgb(0, 0, 0)':
                        document.getElementById('textcolor-black').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-black');
                        break;
                    case 'rgb(128, 128, 128)':
                        document.getElementById('textcolor-gray').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-gray');
                        break;
                    case 'rgb(255, 255, 255)':
                        document.getElementById('textcolor-white').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-white');
                        break;
                    case 'rgb(0, 128, 128)':
                        document.getElementById('textcolor-teal').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-teal');
                        break;
                    case 'rgb(0, 0, 255)':
                        document.getElementById('textcolor-blue').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-blue');
                        break;
                    case 'rgb(255, 69, 0)':
                        document.getElementById('textcolor-red').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-red');
                        break;
                    case 'rgb(0, 255, 255)':
                        document.getElementById('textcolor-cyan').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-cyan');
                        break;
                    case 'rgb(127, 255, 0)':
                        document.getElementById('textcolor-lightgreen').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-lightgreen');
                        break;
                    case 'rgb(255, 255, 0)':
                        document.getElementById('textcolor-yellow').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-yellow');
                        break;
                    default:
                        document.getElementById('textcolor-custom').setAttribute('focus', 'true');
                        this.CURRENT_SELECTED_TEXT_COLOR = document.getElementById('textcolor-custom');
                        if(userContent.CURRENT_SELECTED != '') {
                            // Change textcolor-custom bgcolor to the selected element's bgcolor if present
                            document.getElementById('textcolor-custom').style.backgroundColor = userContent.CURRENT_SELECTED.style.color;
                            // Also change the color picker's color without triggering the onchange event
                            action_hub.text_color_picker.setColor(userContent.CURRENT_SELECTED.style.color, true);
                        }
                        break;
                }
            }
        }
    }
}