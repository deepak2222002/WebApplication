var tokken = "";
function show() {
	var x = document.getElementById("password");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}

$(document).ready(function() {

	$(document).on('keydown', '.inputs', function(e) {
		if (event.key === "Enter") {
			event.preventDefault();
			$("#loginButton").click();
		}
	});

	$("#loginButton").click(function(e) {
		e.preventDefault();

		$("#loadingBackdropModalMessage").text("Please wait validating user...");
		$("#loadingBackdropButton").click();

		var employeeId = $("input[name=username]").val();
		var password = $("input[name=password]").val();

		var formData = {
			employeeId: employeeId,
			password: password
		}
		$.ajax({
			type: 'post',
			url: "/WebApplication/auth/login",
			data: JSON.stringify(formData),
			//	async: false,
			contentType: "application/json",
			success: function(response) {

				sessionStorage.setItem('token', response.jwtToken);
				sessionStorage.setItem('employeeId', response.username);
				sessionStorage.setItem('role', response.role);
				sessionStorage.setItem('department', response.department);
				sessionStorage.setItem('name', response.name);

				setTimeout(function() {
					$("#loadingBackdropButton").click();
					$('#myModal').modal('show');
				}, 500);

				$('.link').off('click').on('click', function(event) {
					var target = event.target.id;
					if (target == "masters") {
						window.location.replace("/WebApplication/masters/dashboard");
					} else if (target == "training") {
						window.location.replace("/WebApplication/dashboard");
					}
				});
			},
			error: function(error) {
				setTimeout(function() {
					$("#loadingBackdropButton").click();
					setTimeout(function() {
						alert(error.responseText);
					}, 200)
				}, 500);

			}

		});

	});
});