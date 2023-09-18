const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); // Para lidar com uploads de arquivos
const bodyParser = require('body-parser'); // Para lidar com dados do formulário

const ejs = require('ejs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Servir arquivos estáticos na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configuração do multer para o upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial

app.get('/', (req, res) => {
    res.render('index');
});

const fs = require('fs');

// Rota para lista de arquivos
app.get('/lista-arquivos', (req, res) => {
  // Lê os arquivos na pasta 'uploads' e os lista
  fs.readdir('uploads', (err, files) => {
    if (err) throw err;
    // console.log(files);
    res.send(files);
  });
});

// Rota para processar dados de um formulário via GET
app.get('/processar', (req, res) => {
  const dados = req.query;
  // Salvar o forms como um json na pasta uploads
    const fs = require('fs');
    fs.writeFile('uploads/form.json', JSON.stringify(dados), function (err) {
      if (err) throw err;
      console.log('Salvo!');
    });
  res.send('Dados recebidos via GET: ' + JSON.stringify(dados));
});

// Rota para lidar com uploads de arquivo via POST
app.post('/upload', upload.single('arquivo'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

// Rota para suportar a aplicação AJAX
app.get('/dados-json', (req, res) => {
  // Checar se o arquivo existe
    const fs = require('fs');
    fs.access('uploads/form.json', fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // Se o arquivo existe, lê o arquivo e retorna o conteúdo
      fs.readFile('uploads/form.json', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);
        res.json(data);
      });
    });
});

// Inicie o servidor na porta 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} http://localhost:${port}`);
});
