  function check(username){
    firebase.database().ref('/Accounts/').once('value').then(function(snapshot) {
        if(Object.keys(snapshot.val()).includes(username)){ 
            start(username, snapshot.val())
        }else{
            reject()
        }
    })
}

if(sessionStorage.getItem('username')){
    console.log("Username: "+sessionStorage.getItem('username'))
    check(sessionStorage.getItem('username'));
}else{
    console.log("no cookie")
    reject()
}


function reject(){
    if((window.location.href).includes("http"))
        window.location = "../index.html"
}

function signOut(){
    sessionStorage.clear();
    reject();
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//auto resize the canvas
var scaleFactor = canvas.width/800
canvas.height = canvas.width/800*600;
ctx.scale(scaleFactor, scaleFactor);

var usernameGlobal;
var projectNameFromParams;

function start(username, data){
    usernameGlobal = username
    document.getElementById("username").innerText = username;
    projectNameFromParams = getParams()["project"];
    if(!projectNameFromParams)
        reject();

    var userData = data[username]
    var projectData;
    for(projectName in userData){
        if(projectNameFromParams == projectName)
             projectData = userData[projectName]
    }
    console.log(projectData.scratchInstuctions)
    if(projectData.questions){
        //QUIZ
        document.getElementById("quizDojo").style.display = "block";

        for(question in projectData.questions){
            var div = document.createElement("DIV")
            var ques = document.createElement("h6");
            ques.classList.add("display-4")
            ques.innerText = question;
            div.appendChild(ques)
            for(index in projectData.questions[question]){
                if(index){
                    var divQues = document.createElement("DIV");
                    divQues.classList.add("form-check")
                    var option = projectData.questions[question][index];
			if(typeof option == 'string' &&option.substring(0,4)=="img:"){
				option = `<img src="`+option.substring(4)+`">`;
            }
            console.log(option)
                    divQues.innerHTML = `        
                    <input class="form-check-input" type="radio" name="`+question+`" id="exampleRadios2" value="`+projectData.questions[question][index]+`">
                    <label class="form-check-label" for="exampleRadios2">
                      `+option+`
                    </label>`
                    div.appendChild(divQues)
                    
                }
            }
            document.getElementById("questions").appendChild(div)
            document.getElementById("questions").appendChild(document.createElement("BR"))
            document.getElementById("questions").appendChild(document.createElement("BR"))
        }
        //document.querySelector('input[name="genderS"]:checked').value;

    }else if(projectData.scratchInstuctions){
        document.getElementById("scratchDojo").style.display = "block";

	document.getElementById("scratchIntructions").innerText = linkify(projectData.scratchInstuctions);

        var input = document.getElementById("scratchInput")

        if(projectData["code"])
            input.value = projectData["code"];
    
        if(projectData["status"] == "UNOPENED")
            firebase.database().ref("Accounts/"+username+"/"+projectNameFromParams).update({
                status: "IN PROGRESS"
            });
    
            
        input.addEventListener("input", function() {
            firebase.database().ref("Accounts/"+username+"/"+projectNameFromParams).update({
                code: input.value,
            });
        }, false);
    
        document.getElementById("submitScratch").style.display = "block";
    }else{
        document.getElementById("codeDojo").style.display = "block";
        var input = document.getElementById("input")
        if(projectData["code"])
            input.innerText = projectData["code"];
    
        if(projectData["status"] == "UNOPENED")
            firebase.database().ref("Accounts/"+username+"/"+projectNameFromParams).update({
                status: "IN PROGRESS"
            });
    
            
            input.addEventListener("input", function() {
                firebase.database().ref("Accounts/"+username+"/"+projectNameFromParams).update({
                    code: input.innerText,
                });
            }, false);
    
            document.getElementById("submit").style.display = "block";
    }
    document.getElementById("loading").style.display = "none";


        
}

function linkify(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

function submit(){
    if(usernameGlobal&&projectNameFromParams){
        document.getElementById("qrcode").innerHTML = ""
        new QRCode(document.getElementById("qrcode"), "http://goldbelt.github.io/sensei/grading/index.html?username="+usernameGlobal+"&project="+projectNameFromParams);
        $('#senseiCheck').modal('show');
        firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).update({
            status: "AWAITING SENSEI APPROVAL",
        },function(){
            console.log("done")
            firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).off('value', statTracker)
            var statTracker = firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).on('value',function(snapshot) {
                if(snapshot.val()["status"] != "AWAITING SENSEI APPROVAL"){
                    if(snapshot.val()["status"] != "DONE"){
                        $('#senseiCheck').modal('hide');
                        var input = document.getElementById("scratchInput")
                        if(snapshot.val()["scratchInstuctions"])
                            if(input.value){
                                window.open(input.value);
                            }
                                
                    }else{
                        window.location.href = "../projects/index.html"
                    }
                }
            })
        });
    }
}

function cancelSubmit(){
    if(usernameGlobal&&projectNameFromParams){
        //window.location.href = "../project/index.html"
        firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).update({
            status: "IN PROGRESS",
        },function(){
            $('#senseiCheck').modal('hide');
        });
    }
}


function run(){
    clear()
    clearErr()
    
    //Stop all timers
    var maxId = setTimeout(function(){}, 0);
    for(var i=0; i < maxId; i+=1) { 
        clearTimeout(i);
    }
    
    //Stop all intervals
    var interval_id = window.setInterval("", 9999);
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);

    try{
        eval(document.getElementById("input").innerText)
        document.getElementById("run").innerText = "Restart";
    }catch(e){
        console.log(e)
        createErr(e)
    }
}

function clear(){
    ctx.clearRect(0, 0, canvas.width/scaleFactor, canvas.height/scaleFactor);
}

var errorBox = document.getElementById("errorBox");
function createErr(message){
    var newDiv = document.createElement("DIV")
    newDiv.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    `+message+`
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`
  errorBox.appendChild(newDiv);
}
function clearErr(){
    errorBox.innerHTML = "";
}

function getParams () {
    var url = window.location.href;
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

function showSubmitBtn(){
    document.getElementById("submit").style.display = "block";
}
