const express = require('express');
const path = require ('path');
// const nodemailer = require('nodemailer');

const app = express();

// server routes can go here...
app.get('./hello', (req, res) => res.send({ hi: 'there' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(webpackMiddleware(webpack(webpackConfig)));
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js');
} else {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  });
}

// nodemailer.createTestAccount((err, account) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'z5oxreja2cmwvs4m@ethereal.email',
//         pass: 'DWaNkbbtDzZa8zsdD7'
//     }
//   });

//   // setup email data with unicode symbols
//   let mailOptions = {
//       from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
//       to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//       subject: 'Hello ✔', // Subject line
//       text: 'Hello world?', // plain text body
//       html: '<b>Hello world?</b>' // html body
//   };

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   });
// }

app.listen(process.env.PORT || 3050, () => console.log('Listening'));


// Username  z5oxreja2cmwvs4m@ethereal.email (also works as a real inbound email address)
// Password  DWaNkbbtDzZa8zsdD7
