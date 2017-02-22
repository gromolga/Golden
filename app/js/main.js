$( document ).ready(function() {
	
	$(".btn-menu").on("click", function(){
		$("#dropdown-menu").slideToggle();
	});

	if ($(window).width() <= 980)
			$("#dropdown-menu").hide();
	$(window).resize(function(){
		if ($(window).width() > 980)
			$("#dropdown-menu").show();
		else
			$("#dropdown-menu").hide();
	})
	
})