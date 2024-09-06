
document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission
  
  saveData(); // Call saveData function to store data in localStorage
});

function saveData() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let contact = document.getElementById("contact").value;
  let password = document.getElementById("Password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  // Password and confirm password validation
  if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return; // Exit the function if passwords don't match
  }

  // Retrieve existing user data or initialize an empty array
  let user_records = JSON.parse(localStorage.getItem("users")) || [];

  // Check if the email already exists
  if (user_records.some((v) => v.email === email)) {
      alert("Duplicate data");
  } else {
      // Add new user record to the array
      user_records.push({
          name: name,
          email: email,
          contact: contact,
          password: password
      });

      // Store updated user records array in localStorage
      localStorage.setItem("users", JSON.stringify(user_records));
      window.location.href="login.html"
      alert("Data saved successfully!");
  }
}
