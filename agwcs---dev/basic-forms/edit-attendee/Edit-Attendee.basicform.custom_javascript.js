$(document).ready(function () {
    var $actions = $("div.form-custom-actions");
    if (!$actions.length) {
      console.error("Couldn’t find div.form-custom-actions");
      return;
    }
  
    // create a proper jQuery button element
    var $btn = $("<button>", {
      type: "button",
      id: "btnSaveValidate",
      class: "btn button1",
      text: "Edit"
    }).appendTo($actions);

    $actions.append("<br/>"); 
    var $deletebtn = $("<button>", {
        type: "button",
        id: "deleteAttendeeButton",
        class: "btn button1",
        text: "Delete"
      }).appendTo($actions);
  
    // bind click *after* the element exists
    $btn.on("click", function (e) {
      e.preventDefault();
      // (optional) run your client validation here…
      if (typeof entityFormClientValidate === "function" && !entityFormClientValidate()) {
        return false;
      }
      if (typeof Page_ClientValidate === "function" && !Page_ClientValidate("")) {
        return false;
      }
      clearIsDirty();
      disableButtons();
      $(this).text("Processing…").prop("disabled", true);
  
      if (typeof editChildProfile === "function") {
        $(this).text("Processing…").prop("disabled", true);
        editChildProfile();
        // reset dirty-flag and re-enable if needed
        clearIsDirty();
        //$(this).prop("disabled", false).text("Edit");
      }
    });

    $deletebtn.on("click", function (e) {
        console.log("delete button clicked")
        e.preventDefault();
        // (optional) run your client validation here…
        if (typeof entityFormClientValidate === "function" && !entityFormClientValidate()) {
            console.log("return false 1")
            return false;
        }
        if (typeof Page_ClientValidate === "function" && !Page_ClientValidate("")) {
            console.log("return false 2")
            return false;
        }
        clearIsDirty();
        disableButtons();
        $(this).text("Processing…").prop("disabled", true);
        disableButtons();
    
        if (typeof deleteChildProfile === "function") {
            console.log("to run deleteChildProfile")
          deleteChildProfile();
          // reset dirty-flag and re-enable if needed
          clearIsDirty();
          //$(this).prop("disabled", false).text("Delete");
        }
      });
  });
  


/*
$(function () {    
    $("div.form-custom-actions").append(`<button type='button' id='btnSaveValidate' name='btnSaveValidate' class='btn button1' 
onclick="javascript: if (typeof entityFormClientValidate === 'function') {
        if (entityFormClientValidate()) {
            if (typeof Page_ClientValidate === 'function') {
                if (Page_ClientValidate('')) {
                    clearIsDirty();
                    disableButtons();
                    this.value = 'Processing...';
                    if (typeof editChildProfile === 'function') {
                        editChildProfile();
                        clearIsDirty();       
                        this.disabled = false;    
                    }
                }
            } else {
                clearIsDirty();
                disableButtons();
                this.value = 'Processing...';
            }
        } else {
            return false;
        }
    } else {
        if (typeof Page_ClientValidate === 'function') {
            if (Page_ClientValidate('')) {
                clearIsDirty();
                disableButtons();
                this.value = 'Processing...';
            }
        } else {
            clearIsDirty();
            disableButtons();
            this.value = 'Processing...';
        }
    };"
>Save</button>`);
});
*/