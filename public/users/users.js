let usersArray = []

/*
async function means that the function can make tasks that take time (like web requests or
file lectures) without cutting the main execution line. Instead of waiting until a task has
been completed, the function can continue y manage the task when its done.
*/
async function loadData(){
    //document.querySelector selects the first element that matchs a specified CSS selector
    //it analyzes the actual html to search for an ID value in a html tag
    let inputUserId = document.querySelector('#userid')
    console.log("value" , inputUserId.value);
    let id = inputUserId.value;

    //Create a string `pathProps` representing the path to which the request will be sent.
    //if the id has a value, the path will be /id, else, the route will be ?pageSize=10
    let pathProps = id? '/'+id: '?pageSize=10';


    console.log("inside");
    // fetch explanation: https://www.youtube.com/watch?v=8mWm8WxBhEY
    let resp = await fetch('/api/users'+pathProps,{
        method :'GET',
        headers: {
            'x-auth':23423
        }
    })

    console.log(resp.status);
    let data = await resp.json()
    console.log(data);
    sessionStorage.setItem('users', JSON.stringify(data))
    usersArray=data;
    showUsersTable(data)
}


function showUsersTable(userArray) {
  let html = /*html*/ `

            
            <table> 
            <tr> 
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
            </tr> 
            ${userArray
              .map((user) => /*html*/ `
                <tr> 
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <a
                            class="btn btn-primary"
                            href="#"
                            role="button"
                            onclick = "editUser('${user.id}')"
                            ><i class="bi bi-pencil-fill"></i>
                        </a>

                        <a
                            class="btn btn-primary"
                            href="#"
                            role="button"
                            onclick = "deleteUser('${user.id}')"
                            ><i class="bi bi-trash3-fill"></i>
                        </a>
   
                    </td>
                </tr>
                `
              )
              .join("")}
            </table>
           `;

  document.querySelector("#info").innerHTML = html;
}


function editUser(id){
    let users = JSON.parse(sessionStorage.getItem('users'))
    let userData = users.find(u => u.id == id)

    console.log("user to edit: ",id);
    let modalId = document.getElementById('userModal');
    console.log(modalId);
    console.log(usersArray);
    
    let myModal = new bootstrap.Modal(modalId, {});

    document.querySelector("#id").value = userData.id;
    document.querySelector("#name").value = userData.name;
    document.querySelector("#email").value = userData.email;
    myModal.show();
    
}

function deleteUser(id){
    console.log("user to delete: ",id);
    //https://sweetalert.js.org/
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user record",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("The user has been deleted!", {
            icon: "success",
          });
        } else {
          swal("The user is safe!");
        }
      });
}

async function storeEditedUser(){
    let id = document.querySelector("#id").value 
    let name = document.querySelector("#name").value
    let email = document.querySelector("#email").value
    
    let userData = {name, email}

    let resp = await fetch('/api/users/'+id,{
        headers:{
            'x-auth':'23432',
            'content-type': 'Application/json'
        },
        method: 'PUT',
        body: JSON.stringify(userData)
    })

    let data = await resp.json()


    if(!data.error){
        //https://sweetalert.js.org/
        swal("Data Updated", "User:"+ data.name + " updated" , "success");
        loadData()
    }else{
        swal("Error", data.error , "error");
    }

    console.log(data);


}