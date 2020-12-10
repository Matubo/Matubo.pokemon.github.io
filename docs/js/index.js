function result_pars(data) {

for(let i=0;i<data.length;i++){
  fetch_for_image(data[i]['name'],data[i]['url'])
  }
  
}

function createDOM(name,data){
  let result_div = document.getElementById("result");
  let name_div;  let image;
  name_div = document.createElement("div");
  name_div.className = "name";
  name_div.innerHTML = name;
 
  image = document.createElement("img");
  image.className = "image";
  image.src = data["sprites"]["front_default"];
 
  result_div.append(name_div, image);
}

function fetch_for_image(name,url){
  fetch(url)
  .then((response) => response.json())
  .then((data) => {console.log(data);createDOM(name,data)});
}

function fetch_request(url) {
  let id = document.getElementById("id").value;
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${id}`)
    .then((response) => response.json())
    .then((data) => {console.log(data);result_pars(data['results'])});
}
