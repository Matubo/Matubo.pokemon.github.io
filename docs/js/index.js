function fetch_request(obj) {
  switch (obj.request) {
    case "GETONEID": {
      if (obj.url) {
        fetch(obj.url)
          .then((response) => response.json())
          .then((data) => {
            createDOM(data);
          });
        console.log(true);
        return true;
      } else {
        fetch(`https://pokeapi.co/api/v2/pokemon/${obj.id}`)
          .then((response) => response.json())
          .then((data) => {
            createDOM(data);
          });
        return true;
      }
    }
    case "GETSOMEID": {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${obj.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          for (let i = 0; i < data["results"].length; i++) {
            fetch_request({
              request: "GETONEID",
              url: data["results"][i]["url"],
            });
          }
        });
    }
  }
}

function createDOM(data) {
  let result_div = document.getElementById("result");
  let id;
  let name_div;
  let image;
  name_div = document.createElement("div");
  name_div.className = "name";
  name_div.innerHTML = `name: ${data["species"]["name"]}`;

  id = document.createElement("div");
  id.className = "id";
  id.innerHTML = `id: ${data["id"]}`;

  image = document.createElement("img");
  image.className = "image";
  image.src = data["sprites"]["front_default"];

  result_div.append(id, name_div, image);
}

function request() {
  let id = document.getElementById("id").value;
  fetch_request({ request: "GETONEID", id: id });
  fetch_request({ request: "GETSOMEID", id: id });
}
