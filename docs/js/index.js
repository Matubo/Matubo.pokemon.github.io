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
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=60&offset=${obj.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let i = 0;
          while (i != data["results"].length) {
            fetch_request({
              request: "GETONEID",
              url: data["results"][i]["url"],
            });
            i++;
          }
        });
    }
  }
}

function createDOM(data) {
  let result_div = document.getElementById("result");

  let id, name_div, image, elem;

  elem = document.createElement("div");
  elem.className = "card";

  id = document.createElement("div");
  id.className = "id";
  id.innerHTML = `id: ${data["id"]}`;

  name_div = document.createElement("div");
  name_div.className = "name";
  name_div.innerHTML = `name: ${data["species"]["name"]}`;

  image = document.createElement("img");
  image.className = "image";
  image.src = data["sprites"]["front_default"];

  elem.append(image, id, name_div);

  result_div.append(elem);
}

function request() {
  let id = document.getElementById("id").value;
  fetch_request({ request: "GETONEID", id: id });
  fetch_request({ request: "GETSOMEID", id: id });
}
