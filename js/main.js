$(document).ready(function() {
	$(window).scroll(function(){  // Tant que la fenêtre défile, le code suivant est tiré
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop; // Obtenez la hauteur après le parchemin
        if(scrollt>200){  // Juge la hauteur du parchemin après200px
            $("#gotop").fadeIn(400); //Fondu
			if($(window).width() >= 1200){
				$(".navbar").stop().fadeTo(400, 0.2);
			}
        }else{
            $("#gotop").fadeOut(400); //Si retourné ou non, fondu en. Doit arrêter (arrêter) avant d'ajouter l'animation, sinon il va clignoter
            if($(window).width() >= 1200){
				$(".navbar").stop().fadeTo(400, 1);
            }
        }
    });
    $("#gotop").click(function(){ //Lorsque vous cliquez sur l'onglet, utilisez animate pour basculer vers le haut dans les 200 millisecondes        
		$("html,body").animate({scrollTop:"0px"},200);
    });
	$(".navbar").mouseenter(function(){
		$(".navbar").fadeTo(100, 1);
	});
    $(".navbar").mouseleave(function(){
		var scrollt = document.documentElement.scrollTop + document.body.scrollTop;
		if (scrollt>200) {
			$(".navbar").fadeTo(100, 0.2);
		}
	});

	replaceMeta();

	$(window).resize(function(){
		replaceMeta();
	});
});

replaceMeta = function(){
	if ($(window).width() < 980) {
		if ($("#side_meta #post_meta").length>0) {
			$("#post_meta").appendTo("#top_meta");
		}
		if ($("#sidebar #site_search").length>0) {
			$("#site_search").appendTo("#top_search");
			$("#site_search #st-search-input").css("width", "95%");
		}
	} else {
		if ($("#top_meta #post_meta").length>0) {
			$("#post_meta").appendTo("#side_meta");
		}
		if ($("#top_search #site_search").length>0) {
			$("#site_search").prependTo("#sidebar");
			$("#site_search #st-search-input").css("width", "85%");
		}
	}
}
