<h1 align="center">Lativ 電商平台前後端分離 project - 後端 👚</h1>

<h2>介紹</h2>  

這是一個衣服販售的電商平台，可以在這裡選擇所需商品，加入購物車完成結帳。

<h2>功能說明</h2>  

* 使用者可以使用自訂、或 facebook 帳號密碼。
* 瀏覽所有商品，將中意商品加入購物車。
* 可以前往購物車結帳。
* 可以前往搜尋列搜尋商品。

<h2>API 文件</h2>   

[ API 文件 ](http://18.179.178.60:3000/api-doc/)

<h2>操作說明</h2>

1. 開啟終端機 (Terminal)，clone 此專案至本機電腦  
```git clone https://github.com/LiyLi1122/lativ-project.git```  

2. cd 到存放專案本機位置  
```cd lativ-project```

3. 安裝 npm 套件   
```npm install```

4. 到 MySQL Workbench 建立專案資料庫  
```create database lativ-project character set utf8mb4 collate utf8mb4_unicode_ci;```   

5. 建立資料表  
```npx sequelize db:migrate```

6. 建立種子資料  
```npx sequelize db:seed:all```

7. 建立 .env 檔案設定環境變數   
```參考 .env.example 設定```

8. 啟動本地伺服器，輸入指令顯示 app is listening on 3000 即成功開啟  
```npm run dev```

<h2>使用工具</h2>

【 主要環境 】  
* Windows 10    
* Node 14.16.0  
* Express 4.16.4   
* MySQL 15.1  


【部署】  
* AWS EC2  
* AWS RDS  
* pm2  
* Github Actions


【 其他 】  
* bcryptjs 2.4.3  
* jsonwebtoken 9.0.0  
* mysql2 2.3.3
* passport 0.4.0
* cors 2.8.5
* validator 13.7.0
* swagger-ui-express 4.6.0
 

<h2>作者</h2>
Lily Wang
