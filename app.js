$('#invalidUser').modal('hide');

function signIn(){
    check(document.getElementById("username").value)
}

function check(username){
    firebase.database().ref('/Accounts/').once('value').then(function(snapshot) {
        if(Object.keys(snapshot.val()).includes(username)){
            sessionStorage.setItem('username', username);
            console.log("redir");
            window.location = "dojo/index.html"
        }else{
            $('#invalidUser').modal('show');
            sessionStorage.removeItem('username')
        }
    })
}


if(sessionStorage.getItem('username')){
    console.log("Username: "+sessionStorage.getItem('username'))
    check(getCookie("username"));
}else{
    console.log("no cookie")
}