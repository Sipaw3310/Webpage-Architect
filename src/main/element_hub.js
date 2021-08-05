// Element hub functions
var element_hub = {

    CURRENT_SELECTED_TAB: 'typo',

    setTab: function(which) {
        console.log('clicked ' + which.id)
        if(which.id == "typo-tab") {
            var this_page = document.getElementById('element_hub-typo-page');
            this_page.style.display = 'block';
            // Hide last selected tab
            if(this.CURRENT_SELECTED_TAB !== null && this.CURRENT_SELECTED_TAB != 'typo') {
                document.getElementById('element_hub-' + this.CURRENT_SELECTED_TAB + '-page').style.display = 'none';
                which.setAttribute('value', 'true');
                document.getElementById(this.CURRENT_SELECTED_TAB + '-tab').setAttribute('value', 'false');
            }
            this.CURRENT_SELECTED_TAB = 'typo';     
        }
        if(which.id == "shape-tab") {
            var this_page = document.getElementById('element_hub-shape-page');
            this_page.style.display = 'block';
            // Hide last selected tab
            if(this.CURRENT_SELECTED_TAB !== null && this.CURRENT_SELECTED_TAB != 'shape') {
                document.getElementById('element_hub-' + this.CURRENT_SELECTED_TAB + '-page').style.display = 'none';
                which.setAttribute('value', 'true');
                document.getElementById(this.CURRENT_SELECTED_TAB + '-tab').setAttribute('value', 'false');
            }
            this.CURRENT_SELECTED_TAB = 'shape';
        }   
    }
}