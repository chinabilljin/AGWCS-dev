var documentbodyContents;
var courseImageType;
var courseImageName = '';

// added 4/7/2025
var ifRTDescriptionChanged = false;
var oldRTDescription = "";

//File upload function called by the PCF
window.uploadImagePCF = function (name, memetype, body) {
  courseImageType = memetype;
  courseImageName = name;
  documentbodyContents = body.substring(body.indexOf(',') + 1);
  $('.image-preview-area').find('img').attr('alt', 'Course Image');
  $('.image-preview-clear-btn').attr('title', 'remove');
};


// 4/7/2025
document.addEventListener("DOMContentLoaded", function () {

  setTimeout(function () {

    const rtdescriptionEl = document.getElementById('cr635_rtdescription');
    
    oldRTDescription = document.getElementById('cr635_rtdescription').value;

    if (rtdescriptionEl) {
        rtdescriptionEl.addEventListener('input', function () {
            ifRTDescriptionChanged = true;
        });
    }
      
    
      // Expand the size of RTE - RTDescription column, added on 4/4/20255
      // Target all CKEditor wrapper containers
      const editors = document.querySelectorAll('.cke');
      editors.forEach(function (editor) {
          editor.style.width = '858px';
          editor.style.maxWidth = '100%';
      });

      // Target the editable iframe container
      const contents = document.querySelectorAll('.cke_contents');
      contents.forEach(function (content) {
          content.style.width = '858px';
          content.style.maxWidth = '1716px';
          content.style.resize = 'both';
          content.style.overflow = 'auto';
      });

      // Optional: Target the container DIVs if present (common in Power Pages forms)
      const editorContainers = document.querySelectorAll('[id$="_Container"]');
      editorContainers.forEach(function (container) {
          container.style.width = '858px';
          if (container.parentElement) {
              container.parentElement.style.width = '858px';
          }
      });
      
  }, 2000); // Delay helps wait for Power Pages rendering
});


$(function () {
  //ON PAGE LOAD
  $('#UpdateButton').first().css({
    display: 'none',
  });

  let imgBaseString = '';
  $('#msdynce_coursecategory').attr('disabled', 'true');
  $('#msdynce_frequency').attr('disabled', 'true');
  $('.image-preview-area').find('img').attr('alt', 'Course Image');
  $('.image-preview-clear-btn').attr('title', 'remove');

  //get the image
  webapi.safeAjax({
    type: 'GET',
    url: "/_api/msdynce_courses({{request.params['id']}})/msdynce_entityimage/?size=full",
    contentType: 'application/json',
    success: function (res, status) {
      if (res) {
        imgBaseString = res.value;
        $('.image-preview-area img').attr('src', 'data:image/png;base64,' + imgBaseString);
      }
    },
  });
  //Edit Course record
  $('#updateCourseButton').click(function (e) {
    // validation
    if (typeof entityFormClientValidate === 'function') {
      if (entityFormClientValidate()) {
        if (typeof Page_ClientValidate === 'function') {
          if (Page_ClientValidate('')) {
            clearIsDirty();
            disableButtons();
            updateCourse();
            this.value = '{{ snippets["Processing..."] }}';
          }
        } else {
          clearIsDirty();
          disableButtons();
          $('#msdynce_coursecategory').attr('disabled', 'false');
          $('#msdynce_frequency').attr('disabled', 'false');
          this.value = '{{ snippets["Processing..."] }}';
        }
      } else {
        return false;
      }
    } else {
      if (typeof Page_ClientValidate === 'function') {
        if (Page_ClientValidate('')) {
          clearIsDirty();
          disableButtons();
          $('#msdynce_coursecategory').attr('disabled', 'false');
          $('#msdynce_frequency').attr('disabled', 'false');
          this.value = '{{ snippets["Processing..."] }}';
        }
      } else {
        clearIsDirty();
        disableButtons();
        $('#msdynce_coursecategory').attr('disabled', 'false');
        $('#msdynce_frequency').attr('disabled', 'false');
        this.value = '{{ snippets["Processing..."] }}';
      }
    }
  });
});

function showDeleteModal() {
  $('#cancelCourseModal').on('shown.bs.modal', function () {
    $('#cancelCourseModal iframe').attr('src', '/delete-course?id={{courseid}}');
  });
}

function updateCourse() {
  //required fields
  var courseName = null;
  var category = null;
  var maxCapacity = null;
  var startDate = null;
  var endDate = null;
  var registrationDate = null;
  var tuition = null;
  var materialCost = null;
  var licenseCost = null;
  // 4/7/2025
  var coursedatetimeDetails = null;
  var cancelDeadlineDate = null; // Cancellation Deadline
  

  if (document.getElementById('cr635_coursedatetimedetails').value) {
    coursedatetimeDetails = document.getElementById('cr635_coursedatetimedetails').value;
  }

  if (document.getElementById('cr635_tuition').value) {
    tuition = parseFloat(document.getElementById('cr635_tuition').value) || 0;
  }
  if (document.getElementById('cr635_materialcost').value) {
    materialCost = parseFloat(document.getElementById('cr635_materialcost').value) || 0;
  }
  if (document.getElementById('cr635_licensecost').value) {
    licenseCost = parseFloat(document.getElementById('cr635_licensecost').value ) || 0;
  }


  if (document.getElementById('msdynce_coursename').value) {
    courseName = document.getElementById('msdynce_coursename').value;
  }
  if (document.getElementById('msdynce_coursecategory').value) {
    category = document.getElementById('msdynce_coursecategory').value;
  }
  if (document.getElementById('msdynce_registerationmaxcapacity').value) {
    maxCapacity = document.getElementById('msdynce_registerationmaxcapacity').value;
  }
  if (document.getElementById('msdynce_coursestartdateandtime_datepicker_description').value) {
    startDate = moment(
      Date.parse(document.getElementById('msdynce_coursestartdateandtime_datepicker_description').value)
    );
  }
  if (document.getElementById('msdynce_courseenddateandtime_datepicker_description').value) {
    endDate = moment(
      Date.parse(document.getElementById('msdynce_courseenddateandtime_datepicker_description').value)
    );
  }
  if (document.getElementById('msdynce_registerationdeadline_datepicker_description').value) {
    registrationDate = moment(
      Date.parse(document.getElementById('msdynce_registerationdeadline_datepicker_description').value)
    );
  }
  if (document.getElementById('cr635_canceldeadline_datepicker_description').value) {
    cancelDeadlineDate = moment(
      Date.parse(document.getElementById('cr635_canceldeadline_datepicker_description').value)
    );
  }



  
  let dataObject = {
    msdynce_coursename: courseName,
    msdynce_coursecategory: category,
    msdynce_registerationmaxcapacity: maxCapacity,
    msdynce_coursestartdateandtime: startDate,
    msdynce_courseenddateandtime: endDate,
    msdynce_registerationdeadline: registrationDate,
    cr635_tuition: tuition,
		cr635_materialcost: materialCost,
    cr635_licensecost: licenseCost,
    cr635_canceldeadline: cancelDeadlineDate,
    cr635_coursedatetimedetails: coursedatetimeDetails,
    
  };

  if (document.getElementById('msdynce_instructorname').value) {
    dataObject['msdynce_InstructorName@odata.bind'] =
      '/contacts(' + document.getElementById('msdynce_instructorname').value + ')';
  }

  var courseTypeValues = '';
  var courseTypes = document
    .getElementById('msdynce_coursetype_i')
    .getElementsByClassName('msos-selecteditems-container')[0]
    .getElementsByTagName('ul')[0]
    .getElementsByTagName('li');
  if (courseTypes.length > 0) {
    dataObject['msdynce_coursetype'] = '';
    for (var i = 0; i < courseTypes.length; i++) {
      if (i !== courseTypes.length - 1) {
        courseTypeValues += courseTypes[i].dataset.value + ', ';
      } else {
        courseTypeValues += courseTypes[i].dataset.value;
      }
    }
    dataObject['msdynce_coursetype'] += courseTypeValues;
  } else {
    dataObject['msdynce_coursetype'] = null;
  }

  // 4/7/2025 to save any update of Rich Text Description. ifRTDescriptionChanged means there is new input.
  
  if (ifRTDescriptionChanged || oldRTDescription != document.getElementById('cr635_rtdescription').value){
    if (document.getElementById('cr635_rtdescription').value) {
        dataObject['cr635_rtdescription'] = document.getElementById('cr635_rtdescription').value;
    }
  }
  
  

  if (document.getElementById('msdynce_frequency').value) {
    dataObject['msdynce_frequency'] = document.getElementById('msdynce_frequency').value;
  } else {
    dataObject['msdynce_frequency'] = null;
  }

  if (document.getElementById('msdynce_coursedescription').value) {
    dataObject['msdynce_coursedescription'] = document.getElementById('msdynce_coursedescription').value;
  } else {
    dataObject['msdynce_coursedescription'] = '';
  }

  
  var gradeLevelValues = '';
  var gradeLevels = document
    .getElementById('msdynce_coursegradelevel_i')
    .getElementsByClassName('msos-selecteditems-container')[0]
    .getElementsByTagName('ul')[0]
    .getElementsByTagName('li');
  if (gradeLevels.length > 0) {
    dataObject['msdynce_coursegradelevel'] = '';
    for (var i = 0; i < gradeLevels.length; i++) {
      if (i !== gradeLevels.length - 1) {
        gradeLevelValues += gradeLevels[i].dataset.value + ', ';
      } else {
        gradeLevelValues += gradeLevels[i].dataset.value;
      }
    }
    dataObject['msdynce_coursegradelevel'] += gradeLevelValues;
  } else {
    dataObject['msdynce_coursegradelevel'] = null;
  }

  var courseDaysValues = '';
  var courseDays = document
    .getElementById('msdynce_coursedays_i')
    .getElementsByClassName('msos-selecteditems-container')[0]
    .getElementsByTagName('ul')[0]
    .getElementsByTagName('li');
  if (courseDays.length > 0) {
    dataObject['msdynce_coursedays'] = '';
    for (var i = 0; i < courseDays.length; i++) {
      if (i !== courseDays.length - 1) {
        courseDaysValues += courseDays[i].dataset.value + ', ';
      } else {
        courseDaysValues += courseDays[i].dataset.value;
      }
    }
    dataObject['msdynce_coursedays'] += courseDaysValues;
  } else {
    dataObject['msdynce_coursedays'] = null;
  }

  if (document.getElementsByClassName('image-preview-area').length === 0) {
    dataObject['msdynce_entityimage'] = null;
    dataObject['msdynce_entityimage_file_name'] = null;
    dataObject['msdynce_entityimage_file_type'] = null;
  }

  if (documentbodyContents) {
    dataObject['msdynce_entityimage'] = documentbodyContents;
    dataObject['msdynce_entityimage_file_name'] = courseImageName;
    dataObject['msdynce_entityimage_file_type'] = courseImageType.substring(courseImageType.indexOf('/') + 1);
  }

  //Call the API
  webapi.safeAjax({
    type: 'PATCH',
    url: "/_api/msdynce_courses({{request.params['id']}})",
    contentType: 'application/json',
    data: JSON.stringify(dataObject),
    success: function (res, status, xhr) {
      //Redirect back to home
      window.location.href = "{{ sitemarkers['C1 Home'].url }}";
    },
    error: function (res, status, xhr) {
      console.log(res.responseText);
    },
  });

  window.location.href = "{{ sitemarkers['C1 Home'].url }}";
}
