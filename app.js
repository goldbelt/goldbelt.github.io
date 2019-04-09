$('#invalidUser').modal('hide');

function signIn(){
    check(document.getElementById("username").value)
}

function check(username){
    firebase.database().ref('/Accounts/').once('value').then(function(snapshot) {
        if(Object.keys(snapshot.val()).includes(username)){
            document.cookie = "username="+username; 
            console.log("redir");
            window.location = "dojo/index.html"
        }else{
            $('#invalidUser').modal('show');
        }
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

if(getCookie("username")!=""){
    console.log("Username: "+getCookie("username"))
    check(getCookie("username"));
}else{
    console.log("no cookie")
}