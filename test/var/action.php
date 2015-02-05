<?php
    $a = isset($_GET["a"]) ? intval($_GET["a"], 10) : 0;
    $b = isset($_GET["b"]) ? intval($_GET["b"], 10) : 0;
    $c = isset($_POST["c"]) ? intval($_POST["c"], 10) : 0;
    $d = isset($_POST["d"]) ? intval($_POST["d"], 10) : 0;
    echo "{a: ".$a.", b: ".$b.", c: ".$c.", d: ".$d." }";
?>