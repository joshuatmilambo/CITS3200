<?php
$id = $_GET['id'];
if(is_numeric($id)){
    $dsn='mysql:host=localhost;dbname=CITS3200';
    try{
        $pdo = new PDO($dsn,'minrui','123456');
        $rs = $pdo->query('select * from `file`  where `id`='.$id);
        $row = $rs->fetchAll();
        $data = $row[0];
        header("Content-Type:${data['type']}");
        echo $data['data'];
        $pdo = null;
    }catch (PDOException $e){
        echo $e->getMessage();
    }
}else{
    exit();
}
?>
