$(document).ready(function () {
    var $actions = $("div.actions");
    if (!$actions.length) {
      console.error("Couldn’t find div.actions");
      return;
    }
  
    // create a proper jQuery button element
    var $btn = $("<button>", {
      type: "button",
      id: "btnSaveValidate",
      class: "btn button1",
      text: "Add"
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
  
      if (typeof addChildProfile === "function") {
        addChildProfile();
        // reset dirty-flag and re-enable if needed
        clearIsDirty();
        //$(this).prop("disabled", false).text("Add");
      }
    });
  });
  