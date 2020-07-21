const accountSid = 'AC0366adc8feceb2094d266df4af112f3d';
const authToken = '5e594ed4051c8b012e63cce4fdecbee9';
const client = require('twilio')(accountSid,authToken );

client.messages.create({
  from: 'whatsapp:+14155238886',
  body: 'Ahoy world!',
  to: 'whatsapp:+966553903500'
}).then(message => console.log(message))