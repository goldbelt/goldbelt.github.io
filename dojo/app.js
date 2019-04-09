

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


  function check(username){
    firebase.database().ref('/Accounts/').once('value').then(function(snapshot) {
        if(Object.keys(snapshot.val()).includes(username)){ 
            start(username)
        }else{
            reject()
        }
    })
}

if(getCookie("username")!=""){
    console.log("Username: "+getCookie("username"))
    check(getCookie("username"));
}else{
    console.log("no cookie")
    reject()
}

function reject(){
    //window.location = "../index.html"
}

function start(username){

}