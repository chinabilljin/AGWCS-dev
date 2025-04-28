document.addEventListener("DOMContentLoaded", function () {
    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses")) || [];
    
    document.querySelectorAll("#courseFilter input[type=checkbox]").forEach((checkbox) => {
      if (selectedCourses.includes(checkbox.value)) {
        checkbox.checked = true;
      }

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          selectedCourses.push(this.value);
        } else {
          selectedCourses = selectedCourses.filter((course) => course !== this.value);
        }
        localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
        this.form.submit();
      });
    });
  });