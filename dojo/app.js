



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

function start(username, data){
    document.getElementById("username").innerText = username;
    var projectNameFromParams = getParams()["project"];
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

        function submit(){
            window.location.href = "../project/index.html"
            firebase.database().ref("Accounts/"+username+"/"+projectNameFromParams).update({
                status: "DONE",
            });
        }
        
}

function run(){
    clear()
    clearErr()
    try{
        eval(document.getElementById("input").innerText)
    }catch(e){
        console.log(e)
        createErr(e)
    }
    
    document.getElementById("run").innerText = "Restart";
    
    
    //Stop all timers
    var maxId = setTimeout(function(){}, 0);
    for(var i=0; i < maxId; i+=1) { 
        clearTimeout(i);
    }
    
    //Stop all intervals
    var interval_id = window.setInterval("", 9999);
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);
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