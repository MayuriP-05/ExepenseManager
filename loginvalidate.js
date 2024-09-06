// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent the default form submission
    
//     saveData(); // Call saveData function to store data in localStorage
//   });

// function saveData(){
//     let email,password;
//      email = document.getElementById("email").value;
//      password = document.getElementById("Password").value;
  
//   let user_records=new Array();
//   user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
//   if(user_records.some((v) =>{
//     return v.email==email&& v.password==password
//   } ))
  
//   {
//     alert("login succesfull")
//     let current_user=user_record.filter((v)=>{
//       return v.email==email && password==password
//     })[0]
//     localStorage.setItem("name",current_user.name);
//     localStorage.setItem("email",current_user.email);
//     window.location.href="dashboard.html"
//   }
//   else{
//     alert("login fail");
//   }
  
//   }

document.getElementById("logIn").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    loginUser(); // Call loginUser function to handle login
});

function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("Password").value;

    // Retrieve existing user data or initialize an empty array
    let user_records = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email and password match an existing record
    let user = user_records.find((v) => v.email === email && v.password === password);

    if (user) {
        alert("Login successful");

        // Store user data for the session
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        
        // Redirect to the dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Login failed. Please check your email and password.");
    }
}
