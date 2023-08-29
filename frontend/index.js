// Variabler
let bookList = document.querySelector("#book-list");
let bookOptions = document.querySelector("#book-select");
let regMessage = document.querySelector("#reg-message");
let loginMessage = document.querySelector("#login-message");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let registerPassword = document.querySelector("#registerPassword");
let identifier = document.querySelector("#identifier")
let loginPassword = document.querySelector("#password")


// anropa API
let renderPage = async () => {
    let response = await axios.get("http://localhost:1339/api/books?populate=*");
    let books = response.data.data;

    bookList.innerHTML = "";
    bookOptions.innerHTML = "";
    books.forEach((book) => {
        bookList.innerHTML += `<li class="book"> 
        <img src="http://localhost:1339${book.attributes.image.data.attributes.url}" height="100" width="100"/> <br>
        <b>Title:</b>${book.attributes.title} <br>
        <b>Author:</b>${book.attributes.author} <br>
        <b>Pages:</b>${book.attributes.pages} <br>
        <b>Release Date:</b>${book.attributes.release} <br>
        <button class="add-to-readlist hidden" onclick="addToReadList(${book.id})">Add to Readlist</button>
        </li>`;
        bookOptions.innerHTML += `<option value="${book.id}">${book.attributes.title}</option>`;
    });

  
    if(sessionStorage.getItem("token")){
        let username = sessionStorage.getItem("user");
        document.querySelector("#welcome-message").classList.remove("hidden");
        document.querySelector("#welcome-message").textContent = `Logged in as: ${username}`;
        document.querySelector("#authentication-box").classList.add("hidden");
        document.querySelector("#logout").classList.remove("hidden");
        document.querySelector("#book-select").classList.remove("hidden");
        document.querySelector("#read-later").classList.remove("hidden");
        document.querySelector("#review-form").classList.remove("hidden");
        document.querySelectorAll(".add-to-readlist").forEach((button) => {
          button.classList.remove("hidden");
        });
    } else {
        document.querySelector("#authentication-box").classList.remove("hidden");
        document.querySelector("#logout").classList.add("hidden");
        document.querySelector("#welcome-message").classList.add("hidden");
        document.querySelector("#review-form").classList.add("hidden");
        document.querySelector("#read-later").classList.add("hidden");
        document.querySelectorAll(".add-to-readlist").forEach((button) => {
          button.classList.add("hidden");
        });
    }
  };


let addToReadList = async (id) => {
    let response = await axios.get(`http://localhost:1339/api/books/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    let book = response.data.data;
    console.log(book)
    let li = document.createElement("li");
    li.textContent = book.attributes.title;
    document.querySelector("#read-list").appendChild(li);
  };


let register = async () => {
    try {
        await axios.post("http://localhost:1339/api/auth/local/register", {
            username:username.value,
            email:email.value,
            password:registerPassword.value,
        });
        username.value = "";
        email.value = "";
        registerPassword.value = "";
        console.log("created user"); 
        regMessage.textContent = "Registration successful!";
        regMessage.classList.add("success-message");
    } catch (error) {
        console.error(error);
        regMessage.textContent = "Registration failed. Please try again.";
        regMessage.classList.add("error-message");
    }
};


let login = async () => {
    try {
        let response = await axios.post("http://localhost:1339/api/auth/local", {
            identifier: identifier.value,
            password: loginPassword.value,
        });
        console.log("logged in");
        sessionStorage.setItem("token", response.data.jwt);
        sessionStorage.setItem("user", response.data.user.username);
        sessionStorage.setItem("userId", response.data.user.id);
        renderPage();
    } catch (error) {
        console.error(error);
        loginMessage.classList.add("error-message");
        loginMessage.textContent = "Incorrect username or password";
    }
};

let clearErrorMessages = () => {
    let errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(errorMessage => errorMessage.remove());
  }

let clearInputFields = () => {
    let inputFields = document.querySelectorAll("input");
    inputFields.forEach(input => input.value = "");
  }

let logout = async () => {
    sessionStorage.clear();
    renderPage();
    clearErrorMessages();
    clearInputFields();
    console.log("im out!!")
  };


let applyTheme = async () => {
   let response = await axios.get("http://localhost:1339/api/startpage");
   let theme = response.data.data.attributes.theme 
   console.log(theme)
   document.querySelector("#theme-wrapper").classList.add(theme);
}

let updateScore = async () => {
  let bookId = document.querySelector("#book-select").value;
  let rating = document.querySelector("#rating").value;

  try {
    let response = await axios.put(`http://localhost:1339/api/books/${bookId}`, {
      attributes: {
        score: rating
      }
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    console.log(response.data);
    let bookOption = document.querySelector(`#book-select option[value="${bookId}"]`);
    bookOption.textContent = `${bookOption.textContent} (${rating})`;

  } catch (error) {
    console.log("failed to update score")
  }
}

document.querySelector("#submit-review").addEventListener("click", updateScore);
document.querySelector("#register").addEventListener("click", register)
document.querySelector("#login").addEventListener("click", login)
document.querySelector("#logout").addEventListener("click", logout);

applyTheme()
renderPage()


