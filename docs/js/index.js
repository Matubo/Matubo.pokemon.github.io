function result_pars(data) {
  let result_div = document.getElementById("result");

  let name_div = document.createElement("div");
  name_div.className = "name";
  name_div.innerHTML = data["species"]["name"];

  let image = document.createElement("img");
  image.className = "image";
  image.src = data["sprites"]["front_default"];

  result_div.append(name_div, image);
  console.log(name);
}

function fetch_request() {
  let id = document.getElementById("id").value;
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((response) => response.json())
    .then((data) => result_pars(data));
}
