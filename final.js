const http = require("http");
const mariadb = require("mariadb");
const url = require("url");


const getConnect = async () => {
    try{ 
        const conn = await mariadb.createConnection('mariadb://root:if2019@db2019.if.unismuh.ac.id:3318/latihan');
        return conn;
    }catch (err){ 
        return err;
    }
};


const mahasiswaFindAll = async () => {
    
    try{
        const conn = await getConnect();
        const rows = await conn.query(`SELECT * FROM mahasiswa LIMIT 10`);
       
        return rows;

    }catch(err){ 
        return err;
    }
};


const mahasiswaFindOne = async (nim) => {
try{
    const conn = await getConnect();
    const rows = await conn.query(`SELECT * FROM mahasiswa WHERE nim=?`, [nim]);
    console.log(rows[0]);
    return rows[0];
}catch (err){
    console.log(err);
    return err;
}finally{
}
};

const server = http.createServer(async(request, response) => {
    const parsedURL = url.parse(request.url,true);
    console.log(parsedURL);

    const mahasiswa = await mahasiswaFindAll();
    const mahasiswafind = await mahasiswaFindOne(`${parsedURL.query.nim}`);
    console.log(mahasiswa);

    if (parsedURL.pathname === '/') {
        response.statusCode = 200;
        response.setHeader("Content-Type", "Text/html");
        mahasiswa.map((elemen) => {
            response.statusCode = 200;
            response.write(`<h2>Daftar Mahasiswa</h2>`)
            response.write(`
            <ul>
                <li><a href="profil?nim=${elemen.nim}">${elemen.nama}</a></li>
    
            </ul>
            `);

        });
        
        response.end();
    
    }else if(parsedURL.pathname === '/profil'){
        response.statusCode = 200;
        response.setHeader("Content-Type", "Text/html");

       
        response.write(`
        <body>
    <h1 align="center">BIODATA MAHASISWA</h1>
  <table width="745" border="1" cellspacing="0" cellpadding="5" align="center">
  <tr align="center" bgcolor="#00FFFF">
  <td width="225">FOTO</td>
  <td width="174">DATA DIRI</td>
  <td width="353">KETERANGAN</td>
  </tr>
  <tr >
  <td rowspan="10" align="center"><img src="https://simak.unismuh.ac.id/upload/mahasiswa/${parsedURL.query.nim}.jpg"></td>
  <td>Nama</td>
  <td>${mahasiswafind.nama}</td>
  </tr>
  <tr >
  <td>NIM</td>
  <td>${mahasiswafind.nim}</td>
  </tr>
  <tr >
  <td>Jenis Kelamin</td>
  <td>${mahasiswafind.jenis_kelamin}</td>
  </tr>
  <tr >
  <td>Provinsi</td>
  <td>${mahasiswafind.provinsi}</td>
  </tr>
  <tr >
  <td>Kabupaten</td>
  <td>${mahasiswafind.kabupaten_kota}</td>
  </tr>
  <tr >
  <td>Kelurahan</td>
  <td>${mahasiswafind.kelurahan}</td>
  </tr>
  <tr >
  <td>Kecamatan</td>
  <td>${mahasiswafind.kecamatan}</td>
  </tr>
  <tr >
  <td>Tanggal Lahir</td>
  <td>${mahasiswafind.tanggal_lahir}</td>
  </tr>
  <tr >
  <td>Email</td>
  <td>${mahasiswafind.email_mahasiswa}</td>
  </tr>
  </table>
   `);
        response.end();
    }else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        response.write('halaman tdk di temukan');
        response.end();
       }

   

}); 

server.listen(4004, () =>{
    console.log(`Server listen http://152.67.102.167:4004`);
    
});
