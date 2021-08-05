function toggle(b) {
  b.value = b.value == 'on' ? 'off' : 'on';
}
var basicSystem = {
	current: {
		dialog: false,
		toast: false,
		dropdown: false
	}
}
function basicDialog(title, text, buttons, attributes) {
	// Move given parameters to basicDialog own variable
	this.title = title;
	this.text = text;
	if(buttons !== undefined) {
		// Buttons must not more than 10, because basicDialog can only handle up to 10 button 
		if(buttons.length > 10) {
			throw 'basicDialog initialization: Dialog must not contain more than 10 buttons';
		} else {
			this.buttons = buttons;
		}
		
	} else {this.buttons = {};}
	if(attributes !== undefined) {
		this.attributes = attributes;
	} else {this.attributes = [];}
	// The list for button onclick event
	this.callbackList = [];
	// Create new elements
	this.dialogbg = document.createElement('div'); // Background
	this.dialog = document.createElement('div'); // Dialog box
	this.dialogtitle = document.createElement('p'); // Title
	this.dialogtext = document.createElement('p'); // Content
	this.dialogControls = document.createElement('div'); // Buttons container
	// Assign a class to each created elements
	this.dialogbg.classList.add('dialog-bg');
	this.dialog.classList.add('dialog');
	this.dialogtitle.innerText = this.title;
	this.dialogtext.innerHTML = this.text;
	this.dialogtitle.classList.add('dialog-title');
	this.dialogtext.classList.add('dialog-text');
	this.dialogControls.classList.add('dialog-controls'); //if attributes doesn't has id, then generate a random number for id
	// Check if attributes has id, if not then assign a random id with integer ranging from 1 to 99
	// !TODO! > create a better algorithm for the id generator
	if (this.attributes.hasOwnProperty('id')) {
		this.dialogbg.setAttribute('id', this.attributes.id);
		this.dialog.setAttribute('id', this.attributes.id + '-box');
		this.attributes.idBox = this.attributes.id + '-box';
	} else {
		var random_id = Math.round(Math.random() * 99 + 1);
		this.dialogbg.setAttribute('id', "dialog_" + random_id);
		this.dialog.setAttribute('id', "dialog_" + random_id + '-box');
		this.attributes.id = "dialog_" + random_id;
		this.attributes.idBox = "dialog_" + random_id + '-box';
	}

	this.dialog.appendChild(this.dialogtitle);
	this.dialog.appendChild(this.dialogtext);

	this.buttonFocus = ''; 
	this.dialogButtons = []; // For storing buttons
	//If buttons variable is exists, then create buttons element
	if (this.buttons !== undefined) {

		for (var i = 0; i < this.buttons.length; i++) {
			//Create new button element every buttons variable length
			var dialogButton = document.createElement('button');
			dialogButton.classList.add('dialog-button');
			dialogButton.innerText = this.buttons[i].text;
			dialogButton.id = this.attributes.id + i;

			var self = this;
			this.callbackList.push(this.buttons[i].onclick);
			if (this.buttons[i].hasOwnProperty('onclick')) {
				if (this.buttons[i].onclick == "remove") {
					dialogButton.addEventListener('click', function(e) {
						self.close();
					});
				} else {
					dialogButton.addEventListener('click', function(e) {
						var which_button = e.target.id;
						self.callbackList[which_button[which_button.length - 1]]();
					});
				}
			}
			this.dialogButtons.push(dialogButton);
			this.dialogControls.appendChild(dialogButton);

			if (i == 0) {
				this.buttonFocus = dialogButton;
			}
		}

		this.dialog.appendChild(this.dialogControls);
	}

	this.dialogbg.appendChild(this.dialog);

	this.set = function(title, text, buttons, attributes) {
		this.title = title;
		this.text = text;
		if (buttons !== undefined) {
			if(buttons.length > 10){
				throw 'basicDialog set: Dialog must not contain more than 10 buttons';
			} else {this.buttons = buttons}
		}
		if (attributes !== undefined) {this.attributes = attributes;}
	};

	this.updateAll = function() {
		//Update all components with the new variable
		this.dialogtitle.innerHTML = this.title;
		this.dialogtext.innerHTML = this.text;

		if (this.attributes.id !== undefined) {
			this.dialogbg.setAttribute('id', this.attributes.id);
		} else {
			var random_id = Math.round(Math.random() * 99 + 1);
			this.dialogbg.setAttribute('id', "dialog_" + random_id);
			this.dialog.setAttribute('id', "dialog_" + random_id + '-box');
			this.attributes.id = "dialog_" + random_id;
		}
		this.dialogControls.removeChild(this.dialogControls.firstChild);
		if (this.buttons !== undefined) {
			// Reset callbackList
			this.callbackList = [];
			for (var i = 0; i < this.buttons.length; i++) {
				//Create new button element every buttons variable length
				var dialogButton = document.createElement('button');
				dialogButton.classList.add('dialog-button');
				dialogButton.innerText = this.buttons[i].text;
				dialogButton.id = this.attributes.id + i;

				var self = this;
				this.callbackList.push(this.buttons[i].onclick);
				if (this.buttons[i].hasOwnProperty('onclick')) {
					if (this.buttons[i].onclick == "remove") {
						dialogButton.addEventListener('click', function(e) {
							self.close();
						});
					} else {
						dialogButton.addEventListener('click', function(e) {
							var which_button = e.target.id;
							self.callbackList[which_button[which_button.length - 1]]();
							console.log(which_button + ' '+self.callbackList)
						});
					}
				}

				this.dialogControls.appendChild(dialogButton);

				
			}
		}
		if (this.buttonFocus != '' || this.buttonFocus != false) {this.buttonFocus.focus();}
		return true;
	};
	this.updateTitle = function() {
		this.dialogtitle.innerHTML = this.title;
		return this.dialogtitle.textContent;
	};
	this.updateContent = function() {
		this.dialogtext.innerHTML = this.text;
		return this.dialogtext.textContent;
	};
	// Show dialog
	this.show = function () {
		document.body.appendChild(this.dialogbg);
		if (this.buttonFocus != '' || this.buttonFocus != false) {this.buttonFocus.focus();}
		return true;
	};
	// Remove dialog
	this.close = function() {
		var id = this.attributes.id; var idBox = this.attributes.idBox;
		if(window.innerWidth < 480) {
			document.getElementById(id).animate([
				{opacity: '1'},
				{opacity: '0'}
			], {
				duration: 100
			});
			setTimeout(function() {
				document.getElementById(id).remove();
			}, 90); // Set timeout duration lower than animation duration to prevent glitch
		} else {
			document.getElementById(id).animate([
				{opacity: '1'},
				{opacity: '0'}
			], {
				duration: 150
			});
			document.getElementById(idBox).animate([
				{transform: 'scale(1)'},
				{transform: 'scale(0.9)'}
			], {
				duration: 150
			});
			setTimeout(function() {
				document.getElementById(id).remove();
			}, 140); // Set timeout duration lower than animation duration to prevent glitch
		}
		return true;
	};
}

function basicToast(text, duration) {
	try {
		document.getElementById('toast').remove();
	} catch (error) {}

	var toast = document.createElement('div');
	toast.classList.add('toast');
	toast.id = 'toast';
	var toastText = document.createElement('p');
	toastText.innerHTML = text;
	toast.appendChild(toastText);

	var toastDuration = duration;
	var toastDuration_1;

	switch (duration) {

		case undefined:
		if (text.length > 75) {
			toastDuration = 8000;
			toastDuration_1 = 8;
		} else {
			toastDuration = 5000;
			toastDuration_1 = 5;
		}
		break;
		case 1 || 'short':
		toastDuration = 5000;
		toastDuration_1 = 5;
		break;
		case 2 || 'long':
		toastDuration = 8000;
		toastDuration_1 = 8;
		break;
		default:
		toastDuration = duration;
		toastDuration_1 = 0;
		break;
	}
	toast.style.animationDuration = toastDuration_1 + 's';
	document.body.appendChild(toast)
	setTimeout(function () {
		toast.remove();
	}, toastDuration);
}

var basicDropdown = {
	state: false, // Is dropdown opened?
	currrentSelected: '', // Current selected element
	itemSelected: '', // Current selected item
	callbackList: [], // List for callback
	buttonsList: [],
	open: function open(elem, menu, parameters) {
		basicDropdown.callbackList = [];
		if (elem != this.currrentSelected) {
			if (!this.state) {
				this.currrentSelected = elem;
				basicDropdown.previousDisplay = elem.style.position;
				var dropdown = document.createElement('div');
				dropdown.classList.add('dropdown-menu');
				dropdown.id = 'dropdown-menu';
				if (parameters !== undefined) {
					dropdown.id = parameters.id;
				}
				basicDropdown.buttonsList = [];
				for (var i = 0; i < menu.length; i++) {
					var dropdownMenu = document.createElement('button');
					if (menu[i].text !== undefined) {
						dropdownMenu.innerHTML = menu[i].text;
					}
					basicDropdown.callbackList.push(menu[i].onclick);
					basicDropdown.buttonsList.push('dropdown-menu-' + i);
					dropdownMenu.id = 'dropdown-menu-' + i;

					dropdownMenu.classList.add('dropdown-button');

					if(i == 0) {
						basicDropdown.buttonFocus = dropdownMenu;
					}

					dropdown.appendChild(dropdownMenu);
					dropdownMenu.addEventListener('click', function (e) {
						var which_dropdown = e.target.id;
						basicDropdown.close();
						if(basicDropdown.callbackList[which_dropdown.replace(/[^0-9]/g, '')] !== undefined) {
							basicDropdown.callbackList[which_dropdown.replace(/[^0-9]/g, '')]();
						}
						basicDropdown.itemSelected = which_dropdown.replace(/[^0-9]/g, '');
						e.stopPropagation();
					});
				}
				elem.style.display = 'relative';
				var virtualDiv = document.createElement('div');
				
				
				var window_width = document.documentElement.clientWidth;
				var window_height = document.documentElement.clientHeight;
				//console.log('width '+window_width+' '+window_height);
				
				var windowHeight_divided = window_height / 1.6;
				console.log('winheight divided '+windowHeight_divided);
				var dropdown_translateX = '0'; var dropdown_translateY = '5px';
				var dropdown_maxHeight; var dropdown_animateY = '-10px';
				var dropdown_heigtCalculate = (35 * menu.length) + 16;
				//Get offset y
				var dropdown_offsetY = dropdown.getBoundingClientRect().top;
				var elem_offsetY = elem.getBoundingClientRect().top;
				var elem_offsetX = elem.getBoundingClientRect().left;
				console.log('window width height '+window_width+' '+window_height);
				console.log('elem offset x y '+elem_offsetX + ' ' + elem_offsetY);
				if(elem_offsetX > (window_width - 180)) {
					//console.log('mustLeft')
					dropdown_translateX = '-120px'
				}
				if(elem_offsetY > windowHeight_divided) {
					console.log('must up')
					dropdown_maxHeight = (elem_offsetY - 40);
					dropdown.style.maxHeight = dropdown_maxHeight + 'px';
					console.log('dropdown cliheight '+dropdown_heigtCalculate);
					dropdown_translateY = -(dropdown_heigtCalculate + 30);
					dropdown_animateY =  (dropdown_translateY + 20)  + 'px';
					dropdown_translateY =  dropdown_translateY + 'px';
					//console.log('dr '+dropdown_translateY+' '+dropdown_animateY+' '+dropdown.style.maxHeight)
				} else {
					dropdown.style.maxHeight = window_height - elem_offsetY - 60 + 'px';
				}
				dropdown.animate([
					{transform: 'translate('+dropdown_translateX+','+dropdown_animateY+')', opacity: '0'},
					{transform: 'translate('+dropdown_translateX+','+dropdown_translateY+')', opacity: '1'}
				], {
					duration: 100, easing: 'ease-out'
				});
				dropdown.style.transform = "translate(" + dropdown_translateX + ',' + dropdown_translateY + ")";
				elem.appendChild(dropdown);
				if (basicDropdown.buttonFocus != '' || basicDropdown.buttonFocus != false) {
					basicDropdown.buttonFocus.focus();
				}

				this.state = true;
				dropdown.addEventListener('mousedown', function (e) {
				e.stopPropagation();
				});
				elem.addEventListener('mousedown', function (e) {
				e.stopPropagation();
				});
				
				document.addEventListener('mousedown', basicDropdown.mousedown, {once: true});
				document.addEventListener('touchstart', basicDropdown.touchstart, {once: true});
			} else {
				this.close();
				this.open(elem, menu, parameters);
			}
		} else {
			this.close();
		}
	},
	close: function close() {
		if (document.getElementById('dropdown-menu') !== null) {
			document.getElementById('dropdown-menu').remove();
		}
		this.state = false;
		this.currrentSelected = '';
	},
	mousedown: function mousedown(e) {
		var match = false;
		for(var i = 0; i< basicDropdown.buttonsList.length; i++) {
			if(e.target.id == basicDropdown.buttonsList[i]) {
				match = true;
			}
		}
		if(!match) {basicDropdown.close();}
	},
	touchstart: function touchstart(e) {
		var match = false;
		for(var i = 0; i< basicDropdown.buttonsList.length; i++) {
			if(e.target.id == basicDropdown.buttonsList[i]) {
				match = true;
			}
		}
		if(!match) {basicDropdown.close();}
	}
};