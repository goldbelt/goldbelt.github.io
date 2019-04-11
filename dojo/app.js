



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

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var scaleFactor = canvas.width/800
ctx.scale(scaleFactor, scaleFactor);

function reject(){
    if((window.location.href).includes("http"))
        window.location = "../index.html"
}

function signOut(){
    sessionStorage.clear();
    reject();
}

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

function submit(){
    if(usernameGlobal&&projectNameFromParams){
        new QRCode(document.getElementById("qrcode"), "http://goldbelt.github.io/sensei/grading/index.html?username=+"+username+"&project="+projectNameFromParams);
        $('#senseiCheck').modal('show');
        firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).update({
            status: "AWAITING SENSEI APPROVAL",
        },function(){
            console.log("done")
            var statTracker = firebase.database().ref("Accounts/"+usernameGlobal+"/"+projectNameFromParams).on('value',function(snapshot) {
                if(snapshot.val()["status"] != "AWAITING SENSEI APPROVAL"){
                    if(snapshot.val()["status"] != "DONE"){
                        $('#senseiCheck').modal('hide');
                        firebase.database().ref('/path/to/relevant/chatNode').off('value', statTracker)
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