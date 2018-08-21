<?php
// $server ="localhost";
// $user="minrui";
// $password="123456";
// $database="CITS3200";
// $conn=mysqli_connect($server, $user, $password, $database);
// echo "Connection Status:    Database";
// if (!$conn) {
//   die("Connection failed: " . mysqli_connect_error());
//   echo "\"" . $database . "\" <font color=#FF0000>Connection Failed</font>"."</br>";
// }
// echo "\"" . $database . "\" <font color=#1AEE44>Connected Successfully</font>"."</br>";
//
// $id = 2;
// $query = 'select * from `file`  where `id`='.$id;
// $result = mysqli_query($conn,$query);
// list($id,$name,$type,$data) = mysqli_fetch_array($result);
// // $row = mysqli_fetch_array($result);
// // echo $name;
//
// header("Content-type: $type");
// header("Content-Disposition: attachment; filename=$name");
// echo $data;
$id = 2;
if(is_numeric($id)){
    $dsn='mysql:host=localhost;dbname=CITS3200';
    try{
        $pdo = new PDO($dsn,'minrui','123456');
        $rs = $pdo->query('select * from `file`  where `id`='.$id);
        $row = $rs->fetchAll();
        $data = $row[0];
        $name = $data['name'];
        header("Content-Type:${data['type']}");
        header("Content-Disposition: attachment; filename=$name");
        echo $data['data'];
        $pdo = null;
    }catch (PDOException $e){
        echo $e->getMessage();
    }
}else{
    exit();
}


?>
