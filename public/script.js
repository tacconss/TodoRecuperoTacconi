const ul = document.getElementById("ul");
const buttonInvia = document.getElementById("submit");
const inputText = document.getElementById("inputText");
const inputDate = document.getElementById("date");
let lista = [];
const myKey = "chiave";

 function loadList() {
  fetch("/todo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    lista = data.todos;
    console.log(lista);
    lista.forEach((e)=> console.log(e.date))
    lista.forEach((e)=> e.date=e.date.split("T")[0])
    render();
  })
}
 loadList();


function render() {
    let html = "";
    lista.forEach((e, id) => {
      let completo = e.completed ? "done" : "";
      html += `<li id='li_${e.id}' class='divs ${completo}'>
        ${e.inputValue} ${e.date} 
        <button type='button' class='pulsantiConferma' id='bottoneC_${id}'>conferma</button>
        <button type='button' class='pulsantiElimina' id='bottoneE_${e.id}'>elimina</button>
        
  
      </li>`;
    });
    ul.innerHTML = html;
  
    document.querySelectorAll(".pulsantiElimina").forEach((buttonElimina) => {
      buttonElimina.onclick = () => {
        const id = buttonElimina.id.replace("bottoneE_", "");
        remove(id)
        .then(()=> loadList());
      };
    });
  
    document.querySelectorAll(".pulsantiConferma").forEach((buttonConferma) => {
      buttonConferma.onclick = () => {
        const id = buttonConferma.id.replace("bottoneC_", "");
        update(id).then(()=> loadList());
      };
    });
  }




buttonInvia.onclick = () => {
  const data = {
    inputValue: inputText.value,
    completed: false,
    date: inputDate.value
  };

  fetch("/todo/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      lista.push(result.todo); 
      render();
      inputText.value = ""; 
    });
};





async function update(id) {
   //console.log(id);
  const todo = lista[id];
  fetch("/todo/complete", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then(() => {
      if(!todo.completed){
      todo.completed = true;
      }else{
        todo.completed=false
      } 
      render();
      //console.log(todo);
      //console.log("lista"+lista)
    });
}


async function remove(id) {
   // console.log(lista[0].id)
   // console.log(id)
    fetch(`/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        lista = lista.filter((item) => item.id !== id);
        console.log(lista)
        render();
      });
  }

render();