//
// Import dos modulos
//
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Base de Dados
const bcrypt = require('bcrypt'); // Encriptar Passwords
const jwt = require('jsonwebtoken'); // Tokens para Login
const path = require('path');

//
// Express App
//
const app = express();
app.use(express.static('../client'));
app.use(express.static('../client/html'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//
//CORS Security Mechanism
//Permite que uma web page de um dominio aceda a um recurso de outro dominio diferente
//
app.options("*", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
  res.send(200);
})

//
// Modelo do User que está na pasta "models"
//
const User = require('./models/User');

//
// Public Route, endpoint do a página inicial do website
//
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/index.html'));
})

//
// Private Route (CURD)
// CREATE, UPDATE, READ, DELETE
//

// GET -> MOSTRA TODOS OS USERS
app.get('/user',  
async(req, res) => { 
    try {
      const users = await User.find(); // Encontra todos os users da base de dados
      res.status(200).json({users});
    }
    catch(error) {
      res.status(404).json("error");
    }
  }
);

// GET -> PROCURA A INFORMAÇÃO DE UM USER
app.get('/user/:id', checkToken, async(req, res) => {  
    try {
      const id = req.params.id; // ID que se coloca no URL
      const user = await User.findById(id, '-password'); // Verifica se o User existe (e não mostra a password)
      res.status(200).json({user});
    }
    catch(error) {
      res.status(404).json("error");
    }
  }
);

// DELETE -> APAGA UM USER
app.delete('/user/:id', 
  async(req, res) => {
    try {
      const id = req.params.id; // ID que se coloca no URL
      const users = await User.find(); // Encontra todos os users da base de dados
      await User.findByIdAndDelete(id); // Verifica se o User existe e apaga-o
      res.status(200).json({ msg: 'User apagado com Sucesso!'} );
    }
    catch(error) {
      res.status(404).json("error");
    }
  }
);

// PATCH -> ATUALIZA A PASSWORD DE UM USER
app.patch('/user/:id',  
  async(req, res) => {
    try {
      const id = req.params.id; // ID que se coloca no URL
      const {password, confirmpassword} = req.body; // Input do user
      const salt = await bcrypt.genSalt(12); // Encripta a password
      const passwordHash = await bcrypt.hash(password, salt); // Encripta a password

      // Validações para segurança
      if(!password) {
        return res.status(422).json({ msg: 'A password é obrigatória!' }); // Para segurança, verifica se a password foi inserida
      }
      if(password !== confirmpassword) {
        return res.status(422).json({ msg: 'As passwords têm de ser iguais!' }); // Para segurança, verifica se a password e o confirmpassword são iguais
      }

      await User.findByIdAndUpdate({ _id: id}, { password: passwordHash });  // Verifica se o User existe e atualiza a password com a nova
      res.status(200).json({ msg: 'Password alterada com Sucesso!'} );
    }
    catch(error) {
      res.status(404).json("error");
    }
  }
);

//
// Função para verificar o token para poder fazer login
//
function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token)
    return res.status(401).json({ msg: 'Acesso Negado'}); // Verifica se o token foi inserido
  
  try {
    const secret = process.env.SECRET; // Expressão para poder encriptar o token
    jwt.verify(token, secret); // Verificação do Token
    next();
  }
  catch(error) {
    res.status(400).json({msg: "Token inválido"});
  }
}

//
// Criar um registro de um User
//

// POST -> CRIA UM USER
app.post('/registar', async(req, res) => {  

  // Validações para segurança
  if(!req.body.name) {
    return res.status(422).json({ msg: 'O nome é obrigatório!' }); // Para segurança, verifica se o nome foi inserido
  }
  if(!req.body.email) {
    return res.status(422).json({ msg: 'O email é obrigatório!' }); // Para segurança, verifica se o email foi inserido
  }
  if(!req.body.password) {
    return res.status(422).json({ msg: 'A password é obrigatória!' }); // Para segurança, verifica se a password foi inserida
  }
  if(req.body.password !== req.body.confirmpassword) {
    return res.status(422).json({ msg: 'As passwords têm de ser iguais!' }); // Para segurança, verifica se a password e o confirmpassword são iguais
  }

  // Verifica se o email existe
  const userExists = await User.findOne({ email: req.body.email});
  if(userExists)
    return res.status(422).json({ msg: 'Este email já está a ser usado, por favor utilize outro' });

  try {
  // Cria a Password e encripta
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  
  // Cria um User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: passwordHash,
  })
  await user.save();
  console.log(user);
  res.redirect("index.html");
  //res.status(200).json( {msg: 'User criado com sucesso'} );
  }
  catch(error) {
    console.log(error);
    res.status(500).json({msg: "Erro no Servidor"});
    res.redirect("index.html");
  }
})

//
// Login do User
//
app.post('/log_in.html', async (req, res) => {
  const { email, password } = req.body;

  // Validações
  if(!email)
    return res.status(422).json({ msg: 'O email é obrigatório!' }); // Verifica se o email foi inserido
  if(!password)
    return res.status(422).json({ msg: 'A password é obrigatória!' }); // Verifica se a password foi inserida

  // Verifica se o User existe
  const user = await User.findOne({ email: email});
  if(!user)
    return res.status(404).json({ msg: 'Usuário não encontrado!' });
  
  // Verifica se a password está correta
  const checkPassword = await bcrypt.compare(password, user.password);
  if(!checkPassword)
    return res.status(422).json({ msg: 'Password inválida!' });

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({id: user._id,}, secret,) // Faz o login com o token
    console.log(user);
    res.redirect("index.html");
    //res.status(200).json( {msg: 'Autenticação realizada com sucesso', token} );
  }
  catch(error) {
    console.log(error);
    res.status(500).json({msg: "Erro no Servidor"});
    res.redirect("index.html");
  }
})

// Base de Dados
const dbUser = process.env.DB_USER //User da Base de Dados
const dbPassword = process.env.DB_PASS //Pass da Base de Dados

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@Lenda123.44s5hzk.mongodb.net/`)
  .then(() => {
    app.listen(8080); // Está à escuta na porta 8080
    console.log('Ligado à Base de Dados!');
  }).catch((err) => console.log(err));