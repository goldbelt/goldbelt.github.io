function check(username){
    firebase.database().ref('/Accounts/').on('value',function(snapshot) {
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

function start(username, data){
    document.getElementById("username").innerText = username;

    var tableBody = document.getElementById("tableBody")
    var userData = data[username]
    var projects = Object.keys(userData)
    tableBody.innerHTML = "";
    for(project of projects){
        var tr = document.createElement("tr")
        var status = userData[project]["status"];
        var btn="";
        if(status == "DONE"){
            btn=`<button type="button" class="btn btn-success btn-block" style="color: rgb(230, 252, 172); background-color: rgb(255, 196, 0)" onclick="btn('`+project+`')">Revisit</button>`;
        }else if(status == "IN PROGRESS"){
            btn=`<button type="button" class="btn btn-primary btn-block" style="color: rgb(230, 252, 172); background-color: rgb(255, 196, 0)" onclick="btn('`+project+`')">Continue</button>`;
        }else{
            btn=`<button type="button" class="btn btn-info btn-block" style="color: rgb(230, 252, 172); background-color: rgb(255, 196, 0)" onclick="btn('`+project+`')">Start</button>`;
        }
        tr.innerHTML = `<tr>
            <th scope="row" style="color:  rgb(230, 252, 172)">`+project+`</th>
            <td style="color:  rgb(230, 252, 172)">`+status+`</td>
            <td style="background-color: rgb(255, 196, 0); color: black">`+btn+`</td>
         </tr>`
         tableBody.appendChild(tr)
    }
}

function btn( project ){
    window.location.href = "../dojo/index.html?project="+project
}