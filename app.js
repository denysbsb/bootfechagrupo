//* Rotina (CRIAÇÂO DE GRUPOS) 
var rp = require('request-promise');
var _ = require('lodash');
var cron = require('node-cron');

//* Start cronometro de 1 em 1 minuto chama a funçâo
var task = cron.schedule('* * * * *', function() {
    console.log('Chamou a funçâo');
    getAllGroups();
}, false);

console.log('start cronometro');
task.start();
getAllGroups();
var access_token = 'DQVJ2eWpIdy15Ylc0bmpJWFV0alhzX2lWOW9vaWRfVDhZAclZAYdUJTN2hxREFabDVrU1JlTk9FZATNzbk1uVjBhZADlLQkFjNHNZAZAS1rVVhKZAEFHY0RESW5OOW5QN0R1Mk5rNEdBUGQ1Y210ZADlYRV9XYUdNLUV5NU4yNk1NYmNlSDkzdTVwSTVmQ0g0eERJWnhXMmxjSTVKeUJXc3pva2lhYWF0M2tmajhxQTNqNlpyTjQ2cGN0ZAkpFWXhZAaGN2NE1kMERQUVBIU3A5S3NQT1dtZAgZDZD';
var baseUrl = 'https://graph.facebook.com/v2.12/me?access_token='+access_token;
var proxyMaquina = 'http://stefanini:gamouse@10.1.140.76:8080';

//* Pega todos os grupos da communidade Workplace do access_token
// retorna lista de grupos [{id:123, privacity:'OPEN'}]
function getAllGroups() {
    var GRAPH_URL_GROUPS= 'https://graph.facebook.com/community/groups';
    rp({
        url: GRAPH_URL_GROUPS,
        proxy: proxyMaquina,
        headers: {
            Authorization: 'Bearer ' + access_token
        },
        json: true
        })
    .then(function (res) {
        console.log('success list groups');
        validaAbertoSecreto(res.data)
    })
    .catch(function (err) {
        console.log('err');
    });
}

//* verifica o tipo de grupo “Aberto” ou “Secreto”.
function validaAbertoSecreto(grupos) {
    const filtro = _.filter(grupos, (grupo) => {
        return grupo.privacy === 'OPEN' || grupo.privacy === 'SECRET' ;
    });

    var idNIgnorado = validateIgnore(filtro);

    console.log('idIgnoradooo---', idNIgnorado);
    if (idNIgnorado.length > 0){
        console.log('chama funcaooooooo****---');
        idNIgnorado.forEach(data=>{
            editagrupo(data)
        });
        
    }
}

//* 4 - Whitelist Verifica Lista de grupos que não podem ter o tipo alterado
// retorna ids que podem ser alterados: ['123',567]
function validateIgnore(filtro){
    var result = [];

    for (var i = 0; i < filtro.length; i++) {
        if (
           
            filtro[i].id === '1164556426999867'||
            filtro[i].id === '269973310115394' ||
            filtro[i].id === '964643497025216' ||
             //id suzuki
            filtro[i].id === '790758874438914' ||
            filtro[i].id === '298458600636179' ||
            filtro[i].id === '365626860550839' ||
            filtro[i].id === '365626860550839' ||
            filtro[i].id === '152131118726078' ||
            filtro[i].id === '361158307670358' ||
            filtro[i].id === '614951982227871' ||
            filtro[i].id === '1389472191172393'
        ) {
            
        } else {
            result.push(filtro[i].id);
        }
    }

    return result;
}

//* Faz requisicao e edita o grupo para fechado
function editagrupo(id) {
     var id = id;
    
    var url = 'https://graph.facebook.com/'+id+'?privacy=CLOSED';

    rp({
        url: url,
        method: 'POST',
        proxy: proxyMaquina,
        headers: {
            Authorization: 'Bearer ' + access_token
        },
        json: true
        })
    .then(function (res) {
      console.log('success editaGrupo Closed');
       enviaMensagemFeed(id);
    })
    .catch(function (err) {
        console.log('err',err);
    });
}

function enviaMensagemFeed(id) {
      var url = 'https://graph.facebook.com/'+id+'/feed';

      rp({
          url: url,
          method: 'POST',
          proxy: proxyMaquina,
          headers: {
              Authorization: 'Bearer ' + access_token,
              'Content-Type': 'application/json'
          },
          body: {
            "message" : `Ola! 
            A privacidade do seu grupo foi automaticamente alterada para “Fechado”.
            De acordo com as regras de uso do Workplace no Sebrae, a partir de agora só será permitida a criação de Grupos Fechados.`
          },
          json: true
          })
      .then(function (res) {
        console.log('success enviou msg no feed');
      })
      .catch(function (err) {
          console.log('err', err);
      });

}


getAllGroups();


const express = require('express')
const app = express()

var porta = process.env.PORT || 8080;
app.listen(porta, () => console.log('Example app listening on port 3000!'))
