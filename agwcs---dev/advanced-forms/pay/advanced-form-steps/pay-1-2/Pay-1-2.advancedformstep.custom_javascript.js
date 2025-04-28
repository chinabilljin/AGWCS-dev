$(document).ready(function() {
   
    if ($("#contactFullname").length) {
        let contactId = $("#contactFullname").val();
        $("#cr635_payername").val(contactId);
    }

    if ($("#dueamount").length) {
        let payAmount = $("#dueamount").val();
        $("#cr635_payamount").val(payAmount);
    }

});