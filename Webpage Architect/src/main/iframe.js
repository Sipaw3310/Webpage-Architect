// Code for iframe a.k.a user content

function onIframeLoad() {
    iframe = document.getElementById('user-content');
    userContent.IFRAME_CONTENT = iframe.contentWindow;

    let editor_css = document.createElement('link');
    editor_css.setAttribute('href', '../edit_user_content.css');
    editor_css.setAttribute('rel', 'stylesheet');
    iframe.contentWindow.document.head.appendChild(editor_css);

    // Get all elements and add an event to it
    var iframe_bodyElems = iframe.contentWindow.document.body.querySelectorAll('*');
    for(var i = 0; i < iframe_bodyElems.length; i++) {
        iframe_bodyElems[i].addEventListener('dragenter', dragAndDrop.dragenter);
        iframe_bodyElems[i].addEventListener('dragover', dragAndDrop.dragover);
    }
    iframe.contentWindow.document.body.addEventListener('drop', dragAndDrop.drop);
}

// Drag and drop
var dragAndDrop = {
    allowDrop: function(e) {
        e.preventDefault();
    },
    drag: function(ev) {
        console.log('dragged');
        ev.dataTransfer.setData("element", ev.target.id);
    },
    dragenter: function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('dragenter!');
    },
    dragover: function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('dragover!');
    },
    drop: function(ev) {
        console.log('dropped!');
        ev.preventDefault();
        var type = ev.dataTransfer.getData("element");
        switch(type) {
            case "element_hub-add-p":
                console.log('new-p')
                var new_p = document.createElement('p');
                new_p.classList.add('edit-paragraph');
                new_p.setAttribute('data-be', 'p');
                new_p.setAttribute('contentEditable', 'true');
                new_p.innerText = "Type something in here";

                userContent.paragraph.INDEX++;
                new_p.id = "p-" + userContent.paragraph.INDEX;

                var new_p_data = {id: new_p.id, type: 'paragraph', properties: {textColor: 'rgb(0, 0, 0)'}}
                userContent.editor.userChange.push(new_p_data);

                new_p.addEventListener('click', function(e) {
                    e.stopPropagation();
                    userContent.paragraph.paragraphClicked(e.target);
                });
                // Append the newly created textarea to the traget
                ev.target.appendChild(new_p);
            break;
        }
    }
}