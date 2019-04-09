



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

var userData = data[username]
var projects = Object.keys(userData)
    for(project of projects){

}
}

function run(){
    eval(document.getElementById("input").innerText)
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
