'use strict'

const login = document.querySelector('.login').addEventListener("click", function(){
    console.log("We logged in!")
    alert("Login Successful");
    window.open("register.html");
});
