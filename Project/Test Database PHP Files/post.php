<?php
if ($_FILES["file"]["error"] > 0)
{
    echo "Error: " . $_FILES["file"]["error"] . "<br />";
}
else
{
    $type = $_FILES["file"]["type"];
    $name = $_FILES["file"]["name"];
    $size = $_FILES['file']['size'];
    $tmp=$_FILES["file"]["tmp_name"];
    $fp = fopen($tmp,'rb');
    $data = bin2hex(fread($fp,$size));
    $dsn='mysql:host=localhost;dbname=CITS3200';
    echo '<pre>';
    try{
        $pdo = new PDO($dsn,'minrui','123456');
        $pdo->exec("INSERT INTO `file`(`name`,`size`,`type`,`data`) values ('$name',$size,'$type',0x$data)");
        $id = $pdo->lastInsertId();
        echo 'upload success!<a href="view.php?id='.$id.'">View</a>';
        $pdo = null;
    }catch (PDOException $e){
        echo $e->getMessage();
    }
    echo '</pre>';
    fclose($fp);
}
