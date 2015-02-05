<?php
    $a = isset($_GET["callback"]) ? $_GET["callback"] : "jsonp";
    $b = isset($_POST["b"]) ? $_GET["b"] : "{ a: 1, b: 2 }";
    echo $a."(".$b.")";
?>