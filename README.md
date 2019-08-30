# Raspberry Pi

## OSを選択しよう！
Paspberry Piで使えるOSは色々あるけど，今回はデフォルトのOSであるRaspbianで行きます．  
Download URL: https://www.raspberrypi.org/downloads/raspbian/

## SDカードにOSを書き込もう！
~~~bash
$ diskutil list # SDカードを指す前に
/dev/disk0 (internal):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                         251.0 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         250.7 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +250.7 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            200.1 GB   disk1s1
   2:                APFS Volume Preboot                 45.9 MB    disk1s2
   3:                APFS Volume Recovery                510.3 MB   disk1s3
   4:                APFS Volume VM                      4.3 GB     disk1s4

$ diskutil list # SDカードを指してから
/dev/disk0 (internal):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                         251.0 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         250.7 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +250.7 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD            200.1 GB   disk1s1
   2:                APFS Volume Preboot                 45.9 MB    disk1s2
   3:                APFS Volume Recovery                510.3 MB   disk1s3
   4:                APFS Volume VM                      4.3 GB     disk1s4

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *63.2 GB    disk2
   1:                       0xEF                         8.9 MB     disk2s2
 # 新しく表示されたDiskをアンマウント
$ diskutil unmountDisk /dev/disk2
 # SDカードにOSを書き込み
$ sudo dd if=/Users/hama/Downloads/2019-07-10-raspbian-buster-lite.img of=/dev/rdisk2 bs=1m conv=sync
~~~

## Raspberry PiにSDカードを指してを起動してみよう！
~~~bash
raspberrypi login:        # piと入力
Password:                 # raspberryと入力

$ ifconfig                # IPアドレスの確認
$ ping google.com         # pingが通るか確認

$ sudo apt-get update     # とりあえずupdate 
$ sudo apt-get upgrade    # とりあえずupgrade

$ sudo service ssh start  # sshできるようにする

$ sudo apt-get install ttf-kochi-gothic xfonts-intl-japanese xfonts-intl-japanese-big xfonts-kaname # 日本語フォントをインストール
$ sudo apt-get install uim uim-anthy  # 日本語入力
$ sudo apt-get install jfbterm        # 漢字入力

$ sudo raspi-config       # キー配列変えた人は変えようDefaultだとUS配列
4 Localisation Options Set upを選択
I1 Change Localeを選択
ja_JP.UTF-8 UTF-8でスペースし，OKを選択
ja_JP.UTF-8を選択
4 Internationalisation Optionsを選択
I3 Change Keyboard Layoutを選択
Generic 105-key(Intl)PCを選択
Otherを選択
Japaneseを選択
Japanese - Japanese(OADG 109A)を選択
The default for the keyboard layoutを選択
No compose keyを選択
~~~

自分のPCからraspberry piにssh
~~~bash
$ ssh pi@192.168.1.100 # raspberry pi上のifconfigで確認したIPアドレス
~~~

## Apacheサーバを立ててみよう！
~~~bash
$ sudo apt-get install apache2  # apache2をインストール
$ ifconfig                      # IPアドレスを調べる(例: 192.168.1.100)
$ sudo service apache2 start    # apacheの起動

 # 設定ファイルなどを書き換えたり純粋に停止したかったら
$ sudo service apache2 stop     # apacheの停止
$ sudo service apache2 restart  # apacheの再起動
~~~

## Apacheサーバにアクセスしてみよう！
Raspberry Piと同じネットワーク内でブラウザ開いてURLにIPアドレスを直打ちする．  
すると，Hello,Worldチックなページが見える．  
「Apache2 Debian Default Page」

## 自分のページを作ってみよう！
~~~bash
$ cd /var/www/html
$ sudo touch mypage.html
$ sudo chown pi:pi mypage.html
$ echo "Hello,World." > mypage.html
 # 面倒なのでpiでいじれるフォルダを作る
$ sudo mkdir pi
$ chown pi:pi pi
$ cd pi
$ echo "this is pi page!" > index.html
~~~

## phpをインストールしてApache上で動かそう！
~~~bash
$ sudo apt-cache search php7  # php7関連を検索
$ sudo apt-get install php7.3 apache2-mod-php7.3
$ cd /var/www/html/pi/
$ vim info.php # vimがなかったら sudo apt-get install vim
~~~

/var/www/html/pi/info.php を編集
~~~php
<?php
  phpinfo();
?>
~~~

Apacheを再起動
~~~bash
$ sudo service apache2 restart
~~~
ブラウザ開いて http://192.168.1.100/pi/info.php にアクセス！

## MariaDBをインストールしてLAMP環境の完成！
~~~bash
$ sudo apt-get install php7.3-mbstring php7.3-gettext php7.3-mysql mariadb-server
$ sudo systemctl enable mariadb # 起動時に自動で起動
~~~

/etc/php/7.3/apache2/php.ini を編集
~~~php
mbstring.language = Japanese
mbstring.internal_encoding = UTF-8
~~~

/etc/mysql/my.conf を編集
~~~
[client]
default-character-set=utf8mb4

[mysqld]
character-set-server=utf8mb4
skip-character-set-client-handshake
~~~

MariaDBのrootでのアクセス
~~~bash
$ sudo mysql -uroot # sudoで実行するとunix_socketのプラグインのおかげでアクセスできる・・・．
 # 新しいユーザ作ろう．
MariaDB [mysql]> CREATE USER 'pi'@'localhost' IDENTIFIED BY 'raspberry';
MariaDB [mysql]> CREATE USER 'pi'@'127.0.0.1' IDENTIFIED BY 'raspberry';
MariaDB [mysql]> CREATE USER 'pi'@'::1' IDENTIFIED BY 'raspberry';
MariaDB [mysql]> GRANT ALL ON *.* TO 'pi'@'localhost';
MariaDB [mysql]> GRANT ALL ON *.* TO 'pi'@'127.0.0.1';
MariaDB [mysql]> GRANT ALL ON *.* TO 'pi'@'::1';

 # databaseも作っちゃおう．
MariaDB [(none)]> CREATE DATABASE university;
MariaDB [(none)]> ALTER DATABASE university CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

 # 念の為文字コード確認．
MariaDB [(none)]> MariaDB [(none)]> show variables like "chara%";
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8mb4                    |
| character_set_connection | utf8mb4                    |
| character_set_database   | utf8mb4                    |
| character_set_filesystem | binary                     |
| character_set_results    | utf8mb4                    |
| character_set_server     | utf8mb4                    |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.009 sec)

 # table作ろう！
MariaDB [(none)]> CREATE TABLE university.students (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, name VARCHAR(128), sex VARCHAR(12), number VARCHAR(10));
MariaDB [(none)]> CREATE TABLE university.teachers (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, name VARCHAR(128), sex VARCHAR(12), number VARCHAR(10));

 # 確認．
MariaDB [(none)]> DESC university.students;
+--------+--------------+------+-----+---------+----------------+
| Field  | Type         | Null | Key | Default | Extra          |
+--------+--------------+------+-----+---------+----------------+
| id     | int(11)      | NO   | PRI | NULL    | auto_increment |
| name   | varchar(128) | YES  |     | NULL    |                |
| sex    | varchar(12)  | YES  |     | NULL    |                |
| number | varchar(10)  | YES  |     | NULL    |                |
+--------+--------------+------+-----+---------+----------------+
4 rows in set (0.010 sec)

MariaDB [(none)]> DESC university.teachers;
+--------+--------------+------+-----+---------+----------------+
| Field  | Type         | Null | Key | Default | Extra          |
+--------+--------------+------+-----+---------+----------------+
| id     | int(11)      | NO   | PRI | NULL    | auto_increment |
| name   | varchar(128) | YES  |     | NULL    |                |
| sex    | varchar(12)  | YES  |     | NULL    |                |
| number | varchar(10)  | YES  |     | NULL    |                |
+--------+--------------+------+-----+---------+----------------+
4 rows in set (0.006 sec)

 # データも入れちゃおう．
MariaDB [(none)]> use university;
MariaDB [university]> INSERT INTO students (name, sex, number) VALUES ('shirahama shota', 'man', 'DT16A001');
MariaDB [university]> INSERT INTO students (name, sex, number) VALUES ('osaka hanako', 'woman', 'HW16A123');
MariaDB [university]> SELECT * FROM students;
+----+-----------------+-------+----------+
| id | name            | sex   | number   |
+----+-----------------+-------+----------+
|  1 | shirahama shota | man   | DT16A001 |
|  2 | osaka hanako    | woman | HW16A123 |
+----+-----------------+-------+----------+
2 rows in set (0.002 sec)

MariaDB [university]> INSERT INTO teachers (name, sex, number) VALUES ('John Doe', 'man', 'TT19A001');
MariaDB [university]> INSERT INTO teachers (name, sex, number) VALUES ('Monica Osaka', 'woman', 'TT19A123');
MariaDB [university]> SELECT * FROM teachers;
+----+--------------+-------+----------+
| id | name         | sex   | number   |
+----+--------------+-------+----------+
|  1 | John Doe     | man   | TT19A001 |
|  2 | Monica Osaka | woman | TT19A123 |
+----+--------------+-------+----------+
2 rows in set (0.002 sec)

~~~

## phpでMariaDBにアクセスしてみよう！
/var/www/html/pi/index.php を編集
~~~php
<?php
  $DB_USER = "pi";
  $DB_PASSWORD = "raspberry";
  
  try {
    $dbh = new PDO('mysql:host=localhost;dbname=university', $DB_USER, $DB_PASSWORD);
    foreach($dbh->query('SELECT * FROM students') as $student) {
      echo "name: {$student['name']}, sex:{$student['sex']}, number:{$student['number']}".PHP_EOL;
    }
  } catch(PDOException $e) {
    print('ERROR:'.$e->getMessage());
    exit;
  }
?>
~~~

試しにraspberry pi上で実行！
~~~bash
$ php /var/www/html/pi/index.php
~~~

うまくできたら自分のPCからアクセスしてみよう！  
http://192.168.1.100/pi/

## node.jsで通信してみよう！
**自分のPCにnodobrewをインストール**
~~~bash
$ brew -v               # Homebrewがあるか確認 もちろん「$ which brew」とかでもいいよ．
$ brew update           # とりあえずupdate
$ brew upgrade          # とりあえずupgrade
$ brew install nodebrew
~~~

**raspberry piにnodebrewをインストール**
~~~bash
$ curl -L git.io/nodebrew | perl - setup
~~~

**自分のPCとraspberry piにする設定**  
~/.bash_profile を編集
~~~bash
export PATH=$HOME/.nodebrew/current/bin:$PATH
~~~

~/.bash_profile を編集したので再読み込み
~~~bash
$ source ~/.bash_profile
~~~

nodebrewでnode.jsをインストール
~~~bash
$ nodebrew install-binary stable  # 現在の安定版をインストールできる．
$ nodebrew use stable             # 安定版を使用できる．
$ node -v                         # nodeが使えるか確認
~~~

受信側を作ろう  
/var/www/html/pi/node/tcp-server.js を編集
~~~js
const net = require('net')
const host = 'localhost'
const port = 12345

let server = net.createServer((conn) => {
  conn.write('Hello, Client! I am server.')

  // クライアントからデータを受け取った時の処理
  conn.on('data', (data) => {
    console.log(`server-> Recieve client data: ${data} from ${conn.remoteAddress}:${conn.remotePort}`)
    conn.write(`server-> Repeat: ${data}`)
  })

  // クライアントとの通信終了した時の処理
  conn.on('close', () => {
    console.log(`server-> client closed connection.`)
  })
}).listen(port)

console.log(`tcp server start. ${host}:${port}`)
~~~

送信側を作ろう  
/path/to/tcp-client.js
~~~js
const net = require('net')
const host = '192.168.1.100' // raspberry piのipアドレス
const port = '12345'

const client = new net.Socket()

// サーバと通信を接続した時の処理
client.connect(port, host, () => {
  console.log('client-> connected to server.')
  client.write('client-> Hello, Server! I am client.')
})

process.stdin.resume()

// キー入力したデータを送信する処理
process.stdin.on('data', (data) => {
  client.write(data)
})

// サーバからデータを受け取ったときの処理
client.on('data', (data) => {
  console.log(`${data}`)
})

// 通信を終了した時の処理
client.on('close', () => {
  console.log('client-> connection is closed.')
})
~~~

Raspberry pi側
~~~bash
$ cd /var/www/html/pi/node
$ node tcp-server.js
~~~

自分のPC側
~~~bash
$ cd /path/to
$ node tcp-client.js
~~~

## おわり
もちろんnode.jsとMariaDBを接続することもできるし、PHPでTCPサーバを作ることもできるよ！
自分のやりやすい方でやりましょう．

