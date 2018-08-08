// get form items

var email = document.getElementById('email');
var password = document.getElementById('password');
var confirmPassword = document.getElementById('confirmPassword')
var contactNumber = document.getElementById('contactNum');
var skill1 = document.getElementById('skill1');
var skill2 = document.getElementById('skill2');
var skill3 = document.getElementById('skill3');
var due = document.getElementById('due');
var skillReq1 = document.getElementById('skillReq1');
var skillReq2 = document.getElementById('skillReq2');
var skillReq3 = document.getElementById('skillReq3');
var skillReq4 = document.getElementById('skillReq4');

// Error if you leave an input with incorrect fields

if(email) { 
	email.onblur = checkEmail; 
}

if(confirmPassword) { 
	confirmPassword.onblur = checkConfirmPassword; 
}

if(contactNumber) { 
	contactNumber.onblur = checkPhone; 
}

if(skill1) { 
	skill1.onblur = checkSkill1; 
}

if(skill2) { 
	skill2.onblur = checkSkill2; 
}

if(skill3) { 
	skill3.onblur = checkSkill3; 
}

if(due) {
	due.onblur = checkDue;
}

if(skillReq1) {
	skillReq1.onblur = checkSkillReq1;
}
if(skillReq2) {
	skillReq2.onblur = checkSkillReq2;
}
if(skillReq3) {
	skillReq3.onblur = checkSkillReq3;
}
if(skillReq4) {
	skillReq4.onblur = checkSkillReq4;
}

// Ensure everything is valid for 'submit' 

function formApply() {
	var invalid = 0;
	invalid += !checkPhone();
	invalid += !checkEmail();
	invalid += !checkConfirmPassword();
	return invalid === 0;
}

// Ensure at least 3 skills have been entered
function formSkill() {
	var invalid = 0;
	invalid += !checkSkill1();
	invalid += !checkSkill2();
	invalid += !checkSkill3();
	return invalid === 0;
}

// Ensure inputs are ok for the new task
function formTask() {
	var invalid = 0;
	invalid += !checkDue();
	invalid += !checkSkillReq1();
	invalid += !checkSkillReq2();
	invalid += !checkSkillReq3();
	invalid += !checkSkillReq4();
	return invalid === 0;
}

// Validate Individual Fields, Return an Error if Validation Rules Violated
//Basic RegEx email validation used- could use RFC822 but for project 2 we will send verification emails for high accuracy
function checkEmail() {
	var emailError = document.getElementById('emailError');
	var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
	if(!emailRegEx.test(email.value)) {
		emailError.style.color = '#e69b22';
		return false;
	} else {
		emailError.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkConfirmPassword() {
	var confirmPasswordError = document.getElementById('confirmPasswordError');
	if(confirmPassword.value !== password.value){
		confirmPasswordError.style.color = '#e69b22';
		return false;
	} else {
		confirmPasswordError.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkPhone() {
	var phoneError = document.getElementById('contactNumError');
	var phoneRegex = /^\d{10}$/; //Must be a 10 Digit Number
    if (!phoneRegex.test(contactNumber.value)) {
		phoneError.style.color = '#e69b22';
		return false;
	} else {
		phoneError.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkSkill1() {
	var error = document.getElementById('skill1Error');
	if(skill1.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkSkill2() {
	var error = document.getElementById('skill2Error');
	if(skill2.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkSkill3() {
	var error = document.getElementById('skill3Error');
	if(skill3.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkDue() {
	var error = document.getElementById('dueError');
	if(due.value < moment().format('YYYY-MM-DD')){
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkSkillReq1() {
	var error = document.getElementById('skillReqError1');
	if(skillReq1.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}

function checkSkillReq2() {
	var error = document.getElementById('skillReqError2');
	if(skillReq2.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}
function checkSkillReq3() {
	var error = document.getElementById('skillReqError3');
	if(skillReq3.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}
function checkSkillReq4() {
	var error = document.getElementById('skillReqError4');
	if(skillReq4.value === 'N/A') {
		error.style.color = '#e69b22';
		return false;
	} else {
		error.style.color = 'rgb(35, 35, 35)';
		return true;
	}
}