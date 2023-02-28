var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  mode: "text/x-c++src",
  theme: "dracula",
});

var compileBtn = document.getElementById("compile-btn");
var outputDiv = document.getElementById("output");

compileBtn.addEventListener("click", function() {
  var userCode = editor.getValue();
  var compilerOptions = {
    code: userCode,
    compiler: "gcc",
    compiler_version: "10.2.0",
    optimize: "1",
    options: "-Wall -Wextra -pedantic-errors -Werror",
    stdinput: "",
    stdin: false,
    execute: false
  };
  var request = new XMLHttpRequest();
  request.open("POST", "https://wandbox.org/api/compile.json", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      var output = data.program_output || data.compiler_error || data.compiler_message;
      outputDiv.textContent = output;
    } else {
      outputDiv.textContent = "Error: Unable to compile code.";
    }
  };
  request.onerror = function() {
    outputDiv.textContent = "Error: Failed to connect to compiler server.";
  };
  request.send(JSON.stringify(compilerOptions));
});
