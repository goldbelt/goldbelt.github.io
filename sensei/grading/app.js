var provider = new firebase.auth.GoogleAuthProvider();
var isUser = false;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref("Senseis").once('value',function(snap){
      for(id in snap.val()){
        if(snap.val()[id]==user.email)
          isUser = true;
      }
      if(isUser){
        console.log(user)
        if(getParams()["username"]&&getParams()["project"]){
          document.getElementById("username").innerText = getParams()["username"];
          document.getElementById("project").innerText = getParams()["project"];
            firebase.database().ref("Accounts/"+getParams()["username"]+"/"+getParams()["project"]).update({
                status: "IN PROGRESS",
            },function(){
                console.log("done");
            });
        
        }else{
          alert("Username or project name missing.")
        }
      }else{
        document.getElementById("container").innerHTML = `<h1 class="display-1 text-center">INVALID</h1>
        <h4 class="display-4 text-center">You are not a sensei.</h4>`;
        setTimeout(function(){firebase.auth().signOut()},5000);
      }
    })
  } else {
    firebase.auth().signInWithRedirect(provider);
  }
});




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

function complete(){
  if(isUser){
    firebase.database().ref("Accounts/"+getParams()["username"]+"/"+getParams()["project"]).update({
      status: "DONE",
    },function(){
      firebase.database().ref("Accounts/"+getParams()["username"]).once('value',function(snap){
        firebase.database().ref("Projects/"+(Object.keys(snap.val()).length+1)).once('value',function(snap2){
          if(!snap2.val()){
            firebase.database().ref("Accounts/"+getParams()["username"]).update({
              stat:  "done"
            });
          }else{
            var name = Object.keys(snap2.val())[0]
            snap2.val()["name"]
            firebase.database().ref("Accounts/"+getParams()["username"]).update({
              name:  snap2.val()[name]
            });
          }
        });
      });

        console.log("done");
        document.getElementById("container").innerHTML = `<h1 class="display-1 text-center">DONE</h1>
        <h4 class="display-4 text-center">Close this page</h4>`;
        window.close();
    });
  }
}

function deny(){
  if(isUser){
    firebase.database().ref("Accounts/"+getParams()["username"]+"/"+getParams()["project"]).update({
        status: "IN PROGRESS",
    },function(){
        console.log("done");
        document.getElementById("container").innerHTML = `<h1 class="display-1 text-center">DONE</h1>
        <h4 class="display-4 text-center">Close this page</h4>`;
        window.close();
    });
  }
}