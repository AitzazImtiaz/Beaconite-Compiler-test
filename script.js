// Initialize CodeMirror with C++ mode
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "text/x-c++src",
  lineNumbers: true,
  theme: "dracula",
});

// Get the "Compile" button and output div
var compileBtn = document.getElementById("compile-btn");
var outputDiv = document.getElementById("output");

// Set the Compiler Explorer API URL and options
var compilerExplorerApiUrl = "https://godbolt.org/api/compiler/";
var compilerExplorerOptions = {
  source: "",
  options: "-O2 -std=c++17",
  compilers: ["clang-head"],
};

// Add a click event listener to the "Compile" button
compileBtn.addEventListener("click", function () {
  // Get the user's C++ code from the CodeMirror editor
  var userCode = editor.getValue();

  // Update the Compiler Explorer options with the user's code
  compilerExplorerOptions.source = userCode;

  // Call the Compiler Explorer API with the options
  fetch(compilerExplorerApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(compilerExplorerOptions),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Get the output from the Compiler Explorer response
      var output = data.stdout || data.stderr;

      // Update the output div with the output text
      outputDiv.textContent = output;
    })
    .catch(function (error) {
      // Handle any errors from the API call
      console.error(error);
      outputDiv.textContent = "Error: " + error.message;
    });
});
