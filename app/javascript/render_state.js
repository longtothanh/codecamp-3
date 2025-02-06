$(function () {
  $("#country").on("change", function (e) {
    e.preventDefault();

    const selectedCountry = $(this).val();
    // const formData = $("#weather-form").serialize();
    // console.log(selectedCountry, formData)

    if (selectedCountry) {
      $.ajax({
        url: `/countries/${selectedCountry}/states`,
        method: "GET",
        dataType: "json",
        success: function(data) {
          if ($("#state-wrapper").length === 0) {
            $(".form-group").append('<div id="state-wrapper"></div>');
          }

          let stateSelect = `
            <select class="form-select my-3 me-3 bg-dark" id="state" name="state">
              <option value="">Select State</option>
              ${data.map(state => `<option value="${state.iso2}">${state.name}</option>`).join('')}
            </select>
          `;

          $("#state-wrapper").html(stateSelect);
        },
        error: function(error) {
          console.error("Error fetching states:", error);
          if ($("#state-wrapper").length > 0) {
            $("#state-wrapper").html('<select class="form-select my-3 me-3 bg-dark" disabled><option>Error loading states</option></select>');
          }
        }
      })
    } else {
      $("#state-wrapper, #city-wrapper").empty();
    }
  })
})
