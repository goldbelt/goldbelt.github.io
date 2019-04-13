$('#invalidUser').modal('hide');

function signIn(){
    check(document.getElementById("username").value.toLowerCase())
    var str = "test"
}

function check(username){
    firebase.database().ref('/Accounts/').once('value').then(function(snapshot) {
        if(Object.keys(snapshot.val()).includes(username)){
            sessionStorage.setItem('username',username)
            console.log("redir");
            window.location = "projects/index.html"
        }else{
            $('#invalidUser').modal('show');
        }
    })
}


if(sessionStorage.getItem('username')){
    console.log("Username: "+sessionStorage.getItem('username'))
    check(sessionStorage.getItem('username'));
}else{
    console.log("no cookie")
}