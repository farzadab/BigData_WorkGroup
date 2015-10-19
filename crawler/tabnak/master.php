
<?php
	include "tabnak.php";
	for( $i=200;$i<300;$i++){
		echo "i:".$i;
		get_news_from_page($i);
	}
?>