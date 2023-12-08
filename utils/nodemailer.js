


const nodemailer = require('nodemailer');
const { GetCurrentTime } = require('./GetCurrentTime');

const sendEmail = async (recipients, name,message,clientemail, subject) => {

  // console.log(recipients,name,message,clientemail)


  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mandeeponlinebook@gmail.com',
        pass: 'bwizhoyttpvbvjkk',
      },
    });

  

   
    

    const mailOptions = {
      from: 'mandeeponlinebook.com',
      subject: `NO-REPLY ${subject}`,
      html: `
      <h1>Greetings</h1>
      <br/>
      Email from <h2>${name}</h2>
      <br/>
       ${message}
      <br/>
      from ${clientemail} at ${GetCurrentTime()}
    `
    };

    for (const email of recipients) {
      mailOptions.to = email;
      const info = await transporter.sendMail(mailOptions);
      console.log(`Sent email to ${email}:`, info.response);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};





  
  // module.exports = {
  //   sendEmail,
  // };