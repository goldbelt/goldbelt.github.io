var obj;
var childNums = [];
var totalArrays={};
var fuse;
window.onload = function() {
    firebase.database().ref("Accounts").on('value',function(snapshot) {
        obj = snapshot.val();
        
        var objs = Object.keys(obj);

        var listObj = []
        for(objName of objs){
            var tempObj = {name: objName}
            tempObj["projects"] = obj[objName]
            listObj.push(tempObj);
        }
        

        console.log(listObj)
        console.log(JSON.stringify(listObj))
        var options = {
        shouldSort: true,
        tokenize: true,
        includeScore: true,
        includeMatches: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name"]
        };
        fuse = new Fuse(listObj, options); // "list" is the item array

        for(var cat of childNums){
            var th = document.createElement("th");
            th.scope = "col"
            var textnode=document.createTextNode(cat.charAt(0).toUpperCase() + cat.slice(1));
            th.appendChild(textnode);
            document.getElementById("headRow").appendChild(th)
        }
    });
}

document.getElementById("search").addEventListener("input",function(){
  var query = document.getElementById("search").value
	var tabBody=document.getElementById("propsTable");
	tabBody.innerHTML = "";
  if(query!=""){
    var result = fuse.search(query);
    console.log(result);
    for(var item of result){

      var row=document.createElement("tr");
        console.log(item.score)
      if(item.score <.1){
              row.appendChild(createCell(item.item["name"],null));
              row.appendChild(createCell(Object.keys(item.item["projects"]).length,null));
        console.log(row)
        tabBody.appendChild(row);
      }else{
        break;
      }

    }
  }

});



function createCell(txt,color){
  var cell = document.createElement("td");
  if(color!=null)
    cell.style.backgroundColor = color;
  var textnode=document.createTextNode(txt);
  cell.appendChild(textnode);
  return cell;
}

function newUser(username){
	firebase.database().ref("Projects/0").once('value',function(snap2){
		var name = Object.keys(snap2.val())[0];
		
		firebase.database().ref("Accounts/"+username).set({
			stat: "new account",
			[name]: snap2.val()[name]
		})
	});
}
